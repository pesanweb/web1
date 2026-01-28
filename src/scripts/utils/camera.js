export default class Camera {
    #currentStream;
    #streaming = false;
    #width = 640;
    #height = 0;

    #videoElement;
    #selectCameraElement;
    #canvasElement;

    constructor({ video, cameraSelect, canvas }) {
        this.#videoElement = video;
        this.#selectCameraElement = cameraSelect;
        this.#canvasElement = canvas;

        this.#initialListener();
    }

    #initialListener() {
        this.#selectCameraElement.addEventListener('change', () => {
            this.#streaming = false;
            if (this.#currentStream) {
                this.#currentStream.getTracks().forEach(track => track.stop());
            }
            this.#getStream();
        });

        this.#videoElement.addEventListener('canplay', () => {
            if (!this.#streaming) {
                this.#height = this.#videoElement.videoHeight / (this.#videoElement.videoWidth / this.#width);

                if (isNaN(this.#height)) {
                    this.#height = this.#width / (4 / 3);
                }

                this.#videoElement.setAttribute('width', this.#width);
                this.#videoElement.setAttribute('height', this.#height);
                this.#canvasElement.setAttribute('width', this.#width);
                this.#canvasElement.setAttribute('height', this.#height);
                this.#streaming = true;
            }
        });
    }

    async #getStream() {
        try {
            const deviceId =
                !this.#streaming && !this.#selectCameraElement.value
                    ? undefined
                    : { exact: this.#selectCameraElement.value };

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId,
                },
            });

            if (!this.#selectCameraElement.innerHTML) {
                await this.#populateDeviceList(stream);
            }

            return stream;

        } catch (error) {
            console.error('#getStream: error:', error);
            return null;
        }
    }

    async #populateDeviceList(stream) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        this.#selectCameraElement.innerHTML = '';

        videoDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Camera ${this.#selectCameraElement.length + 1}`;
            this.#selectCameraElement.appendChild(option);
        });
    }

    async launch() {
        if (this.#streaming) return;

        this.#currentStream = await this.#getStream();
        if (this.#currentStream) {
            this.#videoElement.srcObject = this.#currentStream;
            this.#videoElement.play();
        }
    }

    takePicture() {
        const context = this.#canvasElement.getContext('2d');
        if (this.#width && this.#height) {
            this.#canvasElement.width = this.#width;
            this.#canvasElement.height = this.#height;
            context.drawImage(this.#videoElement, 0, 0, this.#width, this.#height);

            return this.#canvasElement.toDataURL('image/png');
        }
        return null;
    }

    stop() {
        this.#videoElement.srcObject = null;
        this.#streaming = false;

        if (this.#currentStream) {
            this.#currentStream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    }
}