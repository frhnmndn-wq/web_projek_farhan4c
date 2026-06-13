(function ($, window) {
    const features = window.CoffeeshopFeatures = window.CoffeeshopFeatures || {};

    features.initLoginFeature = function () {
        const loginScreen = $('#loginScreen');
        const appContent = $('#appContent');

        function showLogin() {
            loginScreen.show();
            appContent.addClass('d-none');
        }

        function showApp() {
            loginScreen.hide();
            appContent.removeClass('d-none');
        }

        $('#loginForm').on('submit', function (e) {
            e.preventDefault();
            const username = $('#loginUsername').val().trim();
            const password = $('#loginPassword').val().trim();

            if (username === 'admin' && password === 'admin123') {
                showApp();
                if (window.showToast) {
                    window.showToast('Login berhasil. Selamat datang di dashboard.', 'success');
                }
            } else if (window.showToast) {
                window.showToast('Login gagal. Username atau password salah.', 'danger');
            }
        });

        $('#logoutLink').on('click', function (e) {
            e.preventDefault();
            $('#loginForm')[0].reset();
            showLogin();
            if (window.showToast) {
                window.showToast('Anda telah keluar dari aplikasi.', 'warning');
            }
        });

        showLogin();
    };
})(jQuery, window);
