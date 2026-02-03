/**
 * StyleForge - Local Fashion Image Transformation
 * 
 * A fully client-side application for local canvas-based outfit transformation.
 * 100% offline-capable with style-based visual effects.
 * 
 * @author StyleForge Team
 * @version 3.0.0 (Local Edition)
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Maximum file size in bytes (10MB)
    maxFileSize: 10 * 1024 * 1024,

    // Accepted file types
    acceptedTypes: ['image/png', 'image/jpeg', 'image/webp'],

    // Toast notification duration
    toastDuration: 3000,

    // Style presets with visual effects
    stylePresets: {
        'editorial': {
            name: 'Editorial',
            contrast: 1.3,
            brightness: 1.05,
            saturation: 0.85,
            warmth: 0,
            vignette: 0.2,
            sharpen: 0.3
        },
        'glamour': {
            name: 'Glamour',
            contrast: 1.15,
            brightness: 1.15,
            saturation: 1.3,
            warmth: 0.15,
            vignette: 0.1,
            sharpen: 0.1
        },
        'avant-garde': {
            name: 'Avant-Garde',
            contrast: 1.4,
            brightness: 0.95,
            saturation: 1.4,
            warmth: -0.1,
            vignette: 0.25,
            sharpen: 0.4
        },
        'minimalist': {
            name: 'Minimalist',
            contrast: 1.08,
            brightness: 1.0,
            saturation: 0.7,
            warmth: 0.05,
            vignette: 0.05,
            sharpen: 0
        },
        'beach': {
            name: 'Beach',
            contrast: 1.05,        // Soft contrast for bright sunlight
            brightness: 1.45,      // Very bright, sunlit beach lighting
            saturation: 1.8,       // Vibrant summer colors
            warmth: 0.45,          // Strong golden sun tones
            vignette: 0.01,        // Almost no vignette - bright everywhere
            sharpen: 0.1           // Light sharpness for beach clarity
        }
    }
};

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    originalImage: null,
    originalImageMimeType: null,
    originalFileName: null,
    transformedImage: null,
    selectedStyle: 'editorial',
    isProcessing: false
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    uploadZone: document.getElementById('uploadZone'),
    fileInput: document.getElementById('fileInput'),
    uploadPlaceholder: document.querySelector('.upload-placeholder'),
    inputPreview: document.getElementById('inputPreview'),

    resultZone: document.getElementById('resultZone'),
    resultPlaceholder: document.querySelector('.result-placeholder'),
    outputPreview: document.getElementById('outputPreview'),

    styleOptions: document.getElementById('styleOptions'),
    clearBtn: document.getElementById('clearBtn'),
    transformBtn: document.getElementById('transformBtn'),
    downloadBtn: document.getElementById('downloadBtn'),

    processing: document.getElementById('processing'),
    processingSteps: {
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),
        step4: document.getElementById('step4')
    }
};

// ============================================
// IMAGE GENERATION SERVICE
// ============================================

const ImageGenerator = {
    /**
     * Generate styled image using canvas transformations
     * @param {string} imageBase64 - Base64 encoded image
     * @param {string} styleKey - Style preset key
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<string>} - Base64 encoded result image
     */
    async generateStyledImage(imageBase64, styleKey, onProgress) {
        onProgress('step1', 'active');
        await this.delay(300);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = async () => {
                try {
                    onProgress('step1', 'done');
                    onProgress('step2', 'active');

                    // Create canvas
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Draw original image
                    ctx.drawImage(img, 0, 0);

                    await this.delay(200);
                    onProgress('step2', 'done');
                    onProgress('step3', 'active');

                    // Get style configuration
                    const style = CONFIG.stylePresets[styleKey];

                    // Apply transformations
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;

                    // Add randomization for variation
                    const seed = Date.now();
                    const variance = (seed % 100) / 1000; // 0 to 0.099

                    // Apply pixel-level transformations
                    for (let i = 0; i < data.length; i += 4) {
                        let r = data[i];
                        let g = data[i + 1];
                        let b = data[i + 2];

                        // Apply warmth (color temperature)
                        const warmthAdjusted = style.warmth + variance;
                        r += warmthAdjusted * 30;
                        b -= warmthAdjusted * 30;

                        // Apply brightness with slight variation
                        const brightnessAdjusted = style.brightness + variance;
                        r *= brightnessAdjusted;
                        g *= brightnessAdjusted;
                        b *= brightnessAdjusted;

                        // Apply contrast
                        const contrastAdjusted = style.contrast + variance;
                        r = ((r / 255 - 0.5) * contrastAdjusted + 0.5) * 255;
                        g = ((g / 255 - 0.5) * contrastAdjusted + 0.5) * 255;
                        b = ((b / 255 - 0.5) * contrastAdjusted + 0.5) * 255;

                        // Apply saturation
                        const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
                        const satAdjusted = style.saturation + variance;
                        r = gray + (r - gray) * satAdjusted;
                        g = gray + (g - gray) * satAdjusted;
                        b = gray + (b - gray) * satAdjusted;

                        // Clamp values
                        data[i] = Math.max(0, Math.min(255, r));
                        data[i + 1] = Math.max(0, Math.min(255, g));
                        data[i + 2] = Math.max(0, Math.min(255, b));
                    }

                    ctx.putImageData(imageData, 0, 0);

                    await this.delay(200);
                    onProgress('step3', 'done');
                    onProgress('step4', 'active');

                    // Apply vignette
                    if (style.vignette > 0) {
                        const gradient = ctx.createRadialGradient(
                            canvas.width / 2, canvas.height / 2, 0,
                            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.7
                        );
                        gradient.addColorStop(0, 'rgba(0,0,0,0)');
                        gradient.addColorStop(1, `rgba(0,0,0,${style.vignette})`);
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }

                    // Apply sharpening effect (simplified)
                    if (style.sharpen > 0) {
                        const sharpened = this.applySharpen(ctx, canvas.width, canvas.height, style.sharpen);
                        ctx.putImageData(sharpened, 0, 0);
                    }

                    await this.delay(300);
                    onProgress('step4', 'done');

                    // Convert to base64
                    const resultData = canvas.toDataURL('image/png');
                    resolve(resultData);

                } catch (error) {
                    reject(new Error('Failed to generate styled image'));
                }
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = imageBase64;
        });
    },

    /**
     * Apply sharpening filter
     */
    applySharpen(ctx, width, height, amount) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const outputData = ctx.createImageData(width, height);

        // Simplified sharpening kernel
        const kernel = [
            0, -amount, 0,
            -amount, 1 + 4 * amount, -amount,
            0, -amount, 0
        ];

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let r = 0, g = 0, b = 0;

                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4;
                        const kernelIdx = (ky + 1) * 3 + (kx + 1);
                        const weight = kernel[kernelIdx];

                        r += data[idx] * weight;
                        g += data[idx + 1] * weight;
                        b += data[idx + 2] * weight;
                    }
                }

                const outputIdx = (y * width + x) * 4;
                outputData.data[outputIdx] = Math.max(0, Math.min(255, r));
                outputData.data[outputIdx + 1] = Math.max(0, Math.min(255, g));
                outputData.data[outputIdx + 2] = Math.max(0, Math.min(255, b));
                outputData.data[outputIdx + 3] = data[outputIdx + 3];
            }
        }

        return outputData;
    },

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// ============================================
// UI CONTROLLER
// ============================================

const UIController = {
    /**
     * Initialize the application
     */
    init() {
        this.bindEvents();
        this.updateUIState();
        console.log('🎨 StyleForge Local Edition v3.0 initialized');
    },

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // File upload events
        elements.uploadZone.addEventListener('click', () => elements.fileInput.click());
        elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop
        elements.uploadZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        elements.uploadZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        elements.uploadZone.addEventListener('drop', (e) => this.handleDrop(e));

        // Control buttons
        elements.clearBtn.addEventListener('click', () => this.clearImage());
        elements.transformBtn.addEventListener('click', () => this.startTransformation());
        elements.downloadBtn.addEventListener('click', () => this.downloadResult());

        // Style selection
        elements.styleOptions.addEventListener('click', (e) => this.handleStyleSelect(e));
    },

    /**
     * Update UI state based on current conditions
     */
    updateUIState() {
        const hasImage = !!state.originalImage;
        const isProcessing = state.isProcessing;
        const hasResult = !!state.transformedImage;

        elements.clearBtn.disabled = !hasImage || isProcessing;
        elements.transformBtn.disabled = !hasImage || isProcessing;
        elements.downloadBtn.disabled = !hasResult || isProcessing;
    },

    /**
     * Handle file input selection
     */
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.processFile(file);
        }
    },

    /**
     * Handle drag over event
     */
    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        elements.uploadZone.classList.add('drag-over');
    },

    /**
     * Handle drag leave event
     */
    handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        elements.uploadZone.classList.remove('drag-over');
    },

    /**
     * Handle file drop
     */
    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        elements.uploadZone.classList.remove('drag-over');

        const file = event.dataTransfer.files[0];
        if (file) {
            this.processFile(file);
        }
    },

    /**
     * Process and validate uploaded file
     */
    processFile(file) {
        // Validate file type
        if (!CONFIG.acceptedTypes.includes(file.type)) {
            this.showToast('Please upload a PNG, JPEG, or WebP image', 'error');
            return;
        }

        // Validate file size
        if (file.size > CONFIG.maxFileSize) {
            this.showToast('Image too large. Maximum size is 10MB', 'error');
            return;
        }

        // Read file
        const reader = new FileReader();
        reader.onload = (e) => {
            state.originalImage = e.target.result;
            state.originalImageMimeType = file.type;
            state.originalFileName = file.name;

            this.displayOriginalImage();
            this.clearResult();
            this.updateUIState();
            this.showToast('Image loaded successfully!');
        };
        reader.onerror = () => {
            this.showToast('Failed to read image file', 'error');
        };
        reader.readAsDataURL(file);
    },

    /**
     * Display the original image in the upload zone
     */
    displayOriginalImage() {
        elements.uploadPlaceholder.classList.add('hidden');
        elements.inputPreview.src = state.originalImage;
        elements.inputPreview.classList.remove('hidden');
        elements.inputPreview.classList.add('animate-fadeIn');
    },

    /**
     * Clear just the result
     */
    clearResult() {
        state.transformedImage = null;
        elements.outputPreview.classList.add('hidden');
        elements.outputPreview.src = '';
        elements.resultPlaceholder.classList.remove('hidden');
        this.updateUIState();
    },

    /**
     * Clear the uploaded image
     */
    clearImage() {
        state.originalImage = null;
        state.originalImageMimeType = null;
        state.originalFileName = null;
        state.transformedImage = null;

        elements.inputPreview.classList.add('hidden');
        elements.inputPreview.src = '';
        elements.uploadPlaceholder.classList.remove('hidden');

        elements.outputPreview.classList.add('hidden');
        elements.outputPreview.src = '';
        elements.resultPlaceholder.classList.remove('hidden');

        elements.fileInput.value = '';

        this.updateUIState();
        this.showToast('Image cleared');
    },

    /**
     * Handle style selection
     */
    handleStyleSelect(event) {
        const button = event.target.closest('.style-option');
        if (!button) return;

        // Update active state
        document.querySelectorAll('.style-option').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update state
        state.selectedStyle = button.dataset.style;
    },

    /**
     * Start the transformation process
     */
    async startTransformation() {
        if (!state.originalImage || state.isProcessing) return;

        state.isProcessing = true;
        this.updateUIState();
        this.showProcessing(true);
        this.clearResult();

        try {
            // Generate styled image locally
            const result = await ImageGenerator.generateStyledImage(
                state.originalImage,
                state.selectedStyle,
                (step, status) => this.updateProcessingStep(step, status)
            );

            state.transformedImage = result;
            this.displayTransformedImage();
            this.showToast('Fashion transformation complete! ✨');

        } catch (error) {
            console.error('Transformation error:', error);
            this.showToast('Transformation failed. Please try again.', 'error');
        } finally {
            state.isProcessing = false;
            this.showProcessing(false);
            this.updateUIState();
        }
    },

    /**
     * Display the transformed image result
     */
    displayTransformedImage() {
        elements.resultPlaceholder.classList.add('hidden');
        elements.outputPreview.src = state.transformedImage;
        elements.outputPreview.classList.remove('hidden');
        elements.outputPreview.classList.add('animate-fadeIn');
        this.updateUIState();
    },

    /**
     * Show/hide processing indicator
     */
    showProcessing(show) {
        if (show) {
            elements.processing.classList.add('active');
            elements.transformBtn.style.display = 'none';
            elements.styleOptions.style.opacity = '0.5';
            elements.styleOptions.style.pointerEvents = 'none';

            // Reset step states
            Object.values(elements.processingSteps).forEach(step => {
                step.classList.remove('active', 'done');
            });
        } else {
            elements.processing.classList.remove('active');
            elements.transformBtn.style.display = '';
            elements.styleOptions.style.opacity = '';
            elements.styleOptions.style.pointerEvents = '';
        }
    },

    /**
     * Update processing step indicator
     */
    updateProcessingStep(stepId, status) {
        const step = elements.processingSteps[stepId];
        if (step) {
            step.classList.remove('active', 'done');
            step.classList.add(status);
        }
    },

    /**
     * Download the transformed result
     */
    downloadResult() {
        if (!state.transformedImage) return;

        const link = document.createElement('a');
        const originalName = state.originalFileName || 'image';
        const baseName = originalName.replace(/\.[^/.]+$/, '');

        link.download = `${baseName}_styleforge_${state.selectedStyle}.png`;
        link.href = state.transformedImage;
        link.click();

        this.showToast('Image downloaded!');
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.success}</span>${message}`;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after duration
        const duration = type === 'info' ? 5000 : CONFIG.toastDuration;
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// ============================================
// INITIALIZATION
// ============================================

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIController.init());
} else {
    UIController.init();
}
