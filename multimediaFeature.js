(function ($, window) {
    const features = window.CoffeeshopFeatures = window.CoffeeshopFeatures || {};

    function makeCoffeeToneDataUrl(durationSeconds = 1.6) {
        const sampleRate = 22050;
        const frameCount = sampleRate * durationSeconds;
        const buffer = new Uint8Array(frameCount * 2);

        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const sample =
                Math.sin(2 * Math.PI * 180 * t) * 0.35 +
                Math.sin(2 * Math.PI * 260 * t) * 0.20 +
                Math.sin(2 * Math.PI * 440 * t) * 0.10;

            const value = Math.max(-1, Math.min(1, sample));
            const int = value < 0 ? value * 32768 : value * 32767;
            buffer[i * 2] = int & 255;
            buffer[i * 2 + 1] = (int >> 8) & 255;
        }

        const wavBuffer = new ArrayBuffer(44 + buffer.length);
        const view = new DataView(wavBuffer);

        function writeString(offset, text) {
            for (let i = 0; i < text.length; i++) {
                view.setUint8(offset + i, text.charCodeAt(i));
            }
        }

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + buffer.length, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, buffer.length, true);

        const bytes = new Uint8Array(wavBuffer);
        for (let i = 0; i < buffer.length; i++) {
            bytes[44 + i] = buffer[i];
        }

        let binary = '';
        bytes.forEach((byte) => {
            binary += String.fromCharCode(byte);
        });

        return 'data:audio/wav;base64,' + btoa(binary);
    }

    function setAudioStatus(message, type = 'success') {
        const statusEl = document.getElementById('audioStatus');
        if (statusEl) {
            statusEl.textContent = 'Status: ' + message;
            statusEl.className = 'd-block mt-2 ' + (type === 'danger' ? 'text-danger' : 'text-muted');
        }
        if (window.showToast) {
            window.showToast(message, type === 'danger' ? 'warning' : 'success');
        }
    }

    features.initMultimediaFeature = function () {
        const playBtn = document.getElementById('playToneBtn');
        const stopBtn = document.getElementById('stopToneBtn');
        const audio = document.getElementById('ambientAudio');

        if (!audio) {
            setAudioStatus('Audio player belum tersedia.', 'danger');
            return;
        }

        audio.volume = 0.65;
        audio.loop = true;

        if (playBtn) {
            playBtn.addEventListener('click', async function () {
                try {
                    if (!audio.paused) {
                        audio.pause();
                        setAudioStatus('Ambience berhenti.', 'success');
                        return;
                    }

                    audio.src = makeCoffeeToneDataUrl();
                    audio.currentTime = 0;
                    await audio.play();
                    setAudioStatus('Ambience CoffeeShop sedang diputar.', 'success');
                } catch (error) {
                    console.error('Audio playback failed:', error);
                    setAudioStatus('Klik tombol lagi untuk mengizinkan suara.', 'danger');
                }
            });
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', function () {
                audio.pause();
                setAudioStatus('Ambience berhenti.', 'success');
            });
        }
    };
})(jQuery, window);