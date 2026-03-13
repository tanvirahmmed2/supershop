export const printPurchaseInvoice = (purchase) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            @page { size: A4; margin: 12mm; }
            body { 
              font-family: 'Inter', -apple-system, sans-serif; 
              color: #1a1a1a; font-size: 12px; margin: 0; padding: 0;
            }
            .header { display: flex; justify-content: space-between; border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 25px; }
            .brand h1 { margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px; }
            .brand p { margin: 2px 0; color: #4b5563; font-weight: 500; }
            
            .meta-info { text-align: right; }
            .meta-info h2 { margin: 0; font-size: 18px; color: #111; text-transform: uppercase; }
            
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
            .section-title { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #9ca3af; border-bottom: 1px solid #e5e7eb; margin-bottom: 8px; padding-bottom: 2px; }
            .detail-text { margin: 0; line-height: 1.5; font-size: 13px; }

            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { text-align: left; padding: 10px; border-bottom: 2px solid #000; font-size: 11px; text-transform: uppercase; }
            td { padding: 12px 10px; border-bottom: 1px solid #f3f4f6; }
            
            .totals-area { display: flex; justify-content: flex-end; margin-top: 30px; }
            .totals-table { width: 250px; }
            .totals-table tr td { padding: 4px 0; border: none; }
            .totals-table tr.total-row { font-size: 16px; font-weight: 900; border-top: 2px solid #000; }

            .footer { margin-top: 60px; border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 10px; }
            .signature-space { display: flex; justify-content: space-between; margin-top: 80px; }
            .sig-box { width: 180px; border-top: 1px solid #000; text-align: center; padding-top: 5px; font-weight: bold; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">
              <h1>SUPER SHOP</h1>
              <p>${purchase.branch_name || 'Main Branch'}</p>
              <p>${purchase.branch_location || ''}</p>
              <p>Phone: ${purchase.branch_phone || ''}</p>
            </div>
            <div class="meta-info">
              <h2>Purchase Invoice</h2>
              <p><strong>Invoice:</strong> ${purchase.invoice_no}</p>
              <p><strong>Date:</strong> ${new Date(purchase.created_at).toLocaleDateString('en-GB', { dateStyle: 'long' })}</p>
            </div>
          </div>

          <div class="details-grid">
            <div>
              <div class="section-title">Supplier Information</div>
              <p class="detail-text"><strong>${purchase.supplier_name}</strong></p>
              <p class="detail-text">${purchase.supplier_phone || ''}</p>
              <p class="detail-text">${purchase.supplier_email || ''}</p>
            </div>
            <div style="text-align: right;">
              <div class="section-title">Purchased By</div>
              <p class="detail-text"><strong>${purchase.staff_name}</strong></p>
              <p class="detail-text">${purchase.role || 'Inventory Manager'}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Item Description</th>
                <th style="text-align: center;">Price</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${purchase.items?.map(item => `
                <tr>
                  <td>
                    <div style="font-weight: bold; font-size: 13px;">${item.product_name || item.name}</div>
                    <div style="font-size: 10px; color: #6b7280;">Barcode: ${item.barcode || 'N/A'}</div>
                  </td>
                  <td style="text-align: center;">৳${parseFloat(item.purchase_price).toFixed(2)}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right; font-weight: bold;">৳${(parseFloat(item.purchase_price) * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals-area">
            <table class="totals-table">
              <tr>
                <td>Subtotal</td>
                <td style="text-align: right;">৳${parseFloat(purchase.total_amount).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td style="text-align: right;">৳${parseFloat(purchase.shipping_cost || 0).toFixed(2)}</td>
              </tr>
              <tr>
                <td style="color: #dc2626;">Discount</td>
                <td style="text-align: right; color: #dc2626;">-৳${parseFloat(purchase.discount || 0).toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td>GRAND TOTAL</td>
                <td style="text-align: right;">৳${parseFloat(purchase.grand_total).toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <div class="signature-space">
            <div class="sig-box">Store Manager</div>
            <div class="sig-box">Supplier Signature</div>
          </div>

          <div class="footer">
            <p>This is an official purchase record for ${purchase.branch_name} By Disibin</p>
            <p>Printed on: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    doc.open();
    doc.write(html);
    doc.close();

    // Ensuring images/fonts load before print dialog
    setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        
        // Auto cleanup
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 500);
    }, 500);
};