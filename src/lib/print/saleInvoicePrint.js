export const printSalesInvoice = (data) => {
  if (!data) return;

  const printWindow = window.open('', '_blank', 'width=600,height=600');
  
  const items = data.items || [];
  const itemsHtml = items.map(item => {
    // FIX: Safely handle slice to prevent crash if name is missing
    const displayName = item.product_name ? item.product_name.slice(0, 25) : 'Unknown Item';
    
    return `
      <tr>
        <td style="padding: 5px 0;">
          <span style="font-weight: bold;">${displayName}</span><br/>
          <small>${item.quantity || 0} x ৳${Number(item.unit_price || 0).toFixed(2)}</small>
        </td>
        <td style="text-align: right; vertical-align: bottom;">৳${(Number(item.quantity || 0) * Number(item.unit_price || 0)).toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  const html = `
    <html>
      <head>
        <title>Receipt - ${data.invoice_no || 'N/A'}</title>
        <style>
          @page { size: 80mm auto; margin: 0; }
          body { 
            font-family: 'Courier New', Courier, monospace; 
            width: 72mm; 
            margin: 0 auto; 
            padding: 10px;
            font-size: 12px;
            line-height: 1.2;
            color: #000;
          }
          .text-center { text-align: center; }
          .border-top { border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px; }
          .border-bottom { border-bottom: 1px dashed #000; margin-bottom: 5px; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          .total-row { font-size: 15px; font-weight: bold; border-top: 1px solid #000; padding-top: 5px; }
          .flex { display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="text-center">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 2px;">SUPER SHOP</h2>
          <p style="margin: 2px 0; font-weight: bold;">${data.branch_name || 'Main Branch'}</p>
          <p style="margin: 2px 0; font-size: 10px;">${data.branch_location || ''}</p>
          <p style="margin: 2px 0; font-size: 10px;">${data.branch_phone || ''}</p>
        </div>

        <div class="border-top" style="margin-top: 10px; font-size: 11px;">
          <div class="flex"><span>Inv:</span> <span>#${data.invoice_no || 'N/A'}</span></div>
          <div class="flex"><span>Date:</span> <span>${data.created_at ? new Date(data.created_at).toLocaleString('en-GB') : 'N/A'}</span></div>
          <div class="flex"><span>Staff:</span> <span>${data.staff_name || 'Counter-1'}</span></div>
          <div class="flex"><span>Cust:</span> <span>${data.customer_name || 'Walk-in'}</span></div>
        </div>

        <table class="border-top">
          <thead>
            <tr class="border-bottom">
              <th align="left" style="font-size: 10px;">ITEM</th>
              <th align="right" style="font-size: 10px;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="border-top" style="margin-bottom: 10px;">
          <div class="flex">
            <span>Subtotal:</span>
            <span>৳${Number(data.total_amount || 0).toFixed(2)}</span>
          </div>
          <div class="flex" style="color: #333;">
            <span>Discount:</span>
            <span>-৳${Number(data.discount_amount || 0).toFixed(2)}</span>
          </div>
          <div class="flex total-row" style="margin-top: 5px;">
            <span>NET TOTAL:</span>
            <span>৳${Number(data.grand_total || 0).toFixed(2)}</span>
          </div>
        </div>

        <div class="border-top text-center" style="padding-top: 10px;">
          <p style="margin: 2px 0; font-weight: bold; text-transform: uppercase;">
             PAID VIA: ${data.payment_method || 'CASH'}
          </p>
          <p style="margin: 10px 0; font-style: italic;">Thank you! Please visit again.</p>
          <div style="font-size: 8px; border-top: 1px solid #eee; padding-top: 5px;">
            Software by Disibin
          </div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
};