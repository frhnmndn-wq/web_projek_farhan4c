(function ($, window) {
    const features = window.CoffeeshopFeatures = window.CoffeeshopFeatures || {};

    features.initDataTableFeature = function () {
        const table = $('#mainTable').DataTable({
            dom: 'Bfrtip',
            buttons: [
                { extend: 'excel', className: 'btn btn-success btn-sm' },
                { extend: 'pdf', className: 'btn btn-danger btn-sm' },
                { extend: 'csv', className: 'btn btn-info btn-sm text-white' }
            ]
        });

        function initTooltips() {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }

        function updateDashboardStats() {
            const totalRows = table.rows().count();
            let totalFiles = 0;
            let signedDocuments = 0;

            table.rows().every(function () {
                const row = $(this.node());
                totalFiles += row.find('td:nth-child(3) .badge').length;
                if (row.find('td:nth-child(4) .text-success').length) {
                    signedDocuments += 1;
                }
            });

            $('#totalDocs').text(totalRows);
            $('#totalCustomers').text(totalRows);
            $('#signedCount').text(signedDocuments);
            $('#fileCount').text(totalFiles);
        }

        $('#liveSearch').on('keyup', function () {
            table.search(this.value).draw();
        });

        initTooltips();
        updateDashboardStats();

        window.CoffeeshopApp = window.CoffeeshopApp || {};
        window.CoffeeshopApp.table = table;
        window.CoffeeshopApp.initTooltips = initTooltips;
        window.CoffeeshopApp.updateDashboardStats = updateDashboardStats;
    };
})(jQuery, window);
