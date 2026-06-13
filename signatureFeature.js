(function ($, window) {
    const features = window.CoffeeshopFeatures = window.CoffeeshopFeatures || {};

    features.initSignatureFeature = function () {
        const canvas = document.getElementById('signaturePad');
        if (!canvas || typeof SignaturePad === 'undefined') {
            return;
        }

        const signaturePad = new SignaturePad(canvas);
        window.CoffeeshopApp = window.CoffeeshopApp || {};
        window.CoffeeshopApp.signaturePad = signaturePad;

        $('#clearSignature').on('click', function () {
            signaturePad.clear();
            if (window.showToast) {
                window.showToast('Tanda tangan berhasil dihapus.', 'warning');
            }
        });

        $('#mainForm').on('submit', function (e) {
            e.preventDefault();
            if (signaturePad.isEmpty()) {
                if (window.showToast) {
                    window.showToast('Silakan bubuhkan tanda tangan terlebih dahulu.', 'warning');
                }
                return;
            }

            const table = window.CoffeeshopApp.table;
            const editRow = $('#formModal').data('editingRow');
            const customerName = $('#mainForm input[name="customerName"]').val().trim();
            const filesInput = $('#mainForm input[name="files[]"]')[0];
            const files = filesInput ? Array.from(filesInput.files) : [];
            const existingSignature = editRow ? (editRow.attr('data-signature') || '') : '';
            const existingAttachments = editRow ? (editRow.attr('data-attachments') || '') : '';

            const attachmentHtml = files.length
                ? files.map(function (file) {
                    return '<span class="badge bg-secondary">' + file.name + '</span>';
                }).join(', ')
                : (editRow ? existingAttachments : '');

            if (!editRow && files.length === 0) {
                if (window.showToast) {
                    window.showToast('Silakan pilih minimal 1 lampiran.', 'warning');
                }
                return;
            }

            let dataUrl = '';
            if (!signaturePad.isEmpty()) {
                dataUrl = signaturePad.toDataURL();
            } else if (editRow && existingSignature) {
                dataUrl = existingSignature;
            }

            if (!dataUrl) {
                if (window.showToast) {
                    window.showToast('Silakan bubuhkan tanda tangan terlebih dahulu.', 'warning');
                }
                return;
            }

            $('#signatureData').val(dataUrl);

            const signatureStatus = '<span class="text-success"><i class="fa-solid fa-circle-check"></i> Signed</span>';
            const actionHtml = '<button type="button" class="btn btn-sm btn-info text-white btn-view" data-bs-toggle="tooltip" title="Lihat detail"><i class="fa-solid fa-eye"></i></button> <button type="button" class="btn btn-sm btn-warning btn-edit" data-bs-toggle="tooltip" title="Edit data"><i class="fa-solid fa-pen-to-square"></i></button> <button type="button" class="btn btn-sm btn-danger btn-delete" data-bs-toggle="tooltip" title="Hapus data"><i class="fa-solid fa-trash"></i></button>';

            if (editRow) {
                const updatedRow = [
                    table.row(editRow).index() + 1,
                    customerName || 'Tanpa Nama',
                    attachmentHtml,
                    signatureStatus,
                    actionHtml
                ];

                table.row(editRow).data(updatedRow).draw(false);
                editRow.attr('data-signature', dataUrl);
                editRow.attr('data-attachments', attachmentHtml);

                if (window.showToast) {
                    window.showToast('Data pelanggan berhasil diperbarui.', 'success');
                }
            } else {
                const addedRow = table.row.add([
                    table.rows().count() + 1,
                    customerName || 'Tanpa Nama',
                    attachmentHtml,
                    signatureStatus,
                    actionHtml
                ]).draw(false);

                $(addedRow.node()).attr('data-signature', dataUrl);
                $(addedRow.node()).attr('data-attachments', attachmentHtml);

                if (window.showToast) {
                    window.showToast('Data pelanggan berhasil disimpan.', 'success');
                }
            }

            window.CoffeeshopApp.initTooltips();
            window.CoffeeshopApp.updateDashboardStats();

            $('#formModal').modal('hide');
            $('#mainForm')[0].reset();
            signaturePad.clear();
            $('#formModal').data('editingRow', null);
        });
    };
})(jQuery, window);
