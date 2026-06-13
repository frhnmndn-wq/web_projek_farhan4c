(function ($, window) {
    const features = window.CoffeeshopFeatures = window.CoffeeshopFeatures || {};

    features.initCrudFeature = function () {
        const table = window.CoffeeshopApp && window.CoffeeshopApp.table;
        if (!table) {
            return;
        }

        function resetFormMode() {
            $('#formModalLabel').text('Form Transaksi Baru');
            $('#mainForm button[type="submit"]').text('Simpan Data');
            $('#formModal').data('editingRow', null);
            $('#mainForm')[0].reset();

            const signaturePad = window.CoffeeshopApp && window.CoffeeshopApp.signaturePad;
            if (signaturePad) {
                signaturePad.clear();
            }
        }

        $(document).on('click', 'button[data-bs-target="#formModal"]', function () {
            resetFormMode();
        });

        $(document).on('click', '.btn-view', function () {
            const row = $(this).closest('tr');
            const rowData = table.row(row).data();
            const signatureData = row.attr('data-signature') || '';

            $('#viewCustomerName').text(rowData[1]);
            $('#viewAttachments').html(rowData[2]);
            $('#viewSignatureStatus').html(rowData[3]);

            if (signatureData) {
                $('#signaturePreview').attr('src', signatureData).show();
                $('#signaturePlaceholder').hide();
            } else {
                $('#signaturePreview').hide();
                $('#signaturePlaceholder').show();
            }

            const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
            viewModal.show();
        });

        $(document).on('click', '.btn-edit', function () {
            const row = $(this).closest('tr');
            const rowData = table.row(row).data();
            const signatureData = row.attr('data-signature') || '';

            $('#formModalLabel').text('Edit Transaksi');
            $('#mainForm button[type="submit"]').text('Perbarui Data');
            $('#mainForm input[name="customerName"]').val(rowData[1] || '');
            $('#formModal').data('editingRow', row);

            const signaturePad = window.CoffeeshopApp && window.CoffeeshopApp.signaturePad;
            if (signaturePad) {
                signaturePad.clear();
                if (signatureData) {
                    try {
                        signaturePad.fromDataURL(signatureData);
                    } catch (error) {
                        console.warn('Gagal memuat tanda tangan untuk edit:', error);
                    }
                }
            }

            const editModal = new bootstrap.Modal(document.getElementById('formModal'));
            editModal.show();
        });

        $(document).on('click', '.btn-delete', function () {
            if (!confirm('Yakin ingin menghapus data ini?')) {
                return;
            }

            const row = $(this).closest('tr');
            table.row(row).remove().draw(false);
            window.CoffeeshopApp.updateDashboardStats();

            if (window.showToast) {
                window.showToast('Data berhasil dihapus.', 'warning');
            }
        });

        $('#formModal').on('hidden.bs.modal', function () {
            resetFormMode();
        });
    };
})(jQuery, window);