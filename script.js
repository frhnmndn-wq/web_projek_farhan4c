(function ($, window) {
    const toastEl = document.getElementById('liveToast');
    const toast = toastEl ? new bootstrap.Toast(toastEl) : null;

    function showToast(message, type = 'success') {
        const body = document.getElementById('toastMessage');
        if (!body || !toast) {
            alert(message);
            return;
        }

        body.textContent = message;
        toastEl.className = 'toast align-items-center border-0 text-white';

        if (type === 'danger') {
            toastEl.classList.add('bg-danger');
        } else if (type === 'warning') {
            toastEl.classList.add('bg-warning');
        } else {
            toastEl.classList.add('bg-success');
        }

        toast.show();
    }

    window.showToast = showToast;

    $(function () {
        const features = window.CoffeeshopFeatures || {};

        if (typeof features.initDataTableFeature === 'function') {
            features.initDataTableFeature();
        }
        if (typeof features.initSignatureFeature === 'function') {
            features.initSignatureFeature();
        }
        if (typeof features.initCrudFeature === 'function') {
            features.initCrudFeature();
        }
        if (typeof features.initLoginFeature === 'function') {
            features.initLoginFeature();
        }
        if (typeof features.initMultimediaFeature === 'function') {
            features.initMultimediaFeature();
        }
    });
})(jQuery, window);