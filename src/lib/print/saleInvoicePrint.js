export const printSalesInvoice = (data) => {
  const printWindow = window.open('', '_blank', 'width=600,height=600');
  
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 5px 0;">
        ${item.product_name}<br/>
        <small>${item.quantity} x ৳${Number(item.unit_price).toFixed(2)}</small>
      </td>
      <td style="text-align: right; vertical-align: bottom;">৳${(item.quantity * item.unit_price).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <html>
      <head>
        <title>Receipt - ${data.invoice_no}</title>
        <style>
          @page { size: 80mm auto; margin: 0; }
          body { 
            font-family: 'Courier New', Courier, monospace; 
            width: 72mm; 
            margin: 0 auto; 
            padding: 10px;
            font-size: 12px;
            line-height: 1.2;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .font-bold { font-weight: bold; }
          .border-top { border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px; }
          .border-bottom { border-bottom: 1px dashed #000; margin-bottom: 5px; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; }
          .total-row { font-size: 14px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="text-center">
          <h2 style="margin: 0; font-size: 18px;">SUPER SHOP</h2>
          <p style="margin: 2px 0;">${data.branch_name}</p>
          <p style="margin: 2px 0; font-size: 10px;">${data.branch_location}</p>
          <p style="margin: 2px 0; font-size: 10px;">Tel: ${data.branch_phone}</p>
        </div>

        <div class="border-top border-bottom" style="margin-top: 10px;">
          <p style="margin: 2px 0;">Inv: ${data.invoice_no}</p>
          <p style="margin: 2px 0;">Date: ${new Date(data.created_at).toLocaleString()}</p>
          <p style="margin: 2px 0;">Cust: ${data.customer_name || 'Walk-in'}</p>
        </div>

        <table>
          <thead>
            <tr class="border-bottom">
              <th class="text-left">Item</th>
              <th class="text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="border-top">
          <div style="display: flex; justify-content: space-between;">
            <span>Subtotal:</span>
            <span>৳${Number(data.total_amount).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Discount:</span>
            <span>-৳${Number(data.discount_amount).toFixed(2)}</span>
          </div>
          <div class="total-row" style="display: flex; justify-content: space-between; margin-top: 5px;">
            <span>NET TOTAL:</span>
            <span>৳${Number(data.grand_total).toFixed(2)}</span>
          </div>
        </div>

        <div class="border-top text-center" style="margin-top: 10px;">
          <p style="margin: 2px 0; font-weight: bold;">Paid via: ${data.payment_method.toUpperCase()}</p>
          <p style="margin: 5px 0;">*** THANK YOU ***</p>
          <p style="font-size: 9px;">Powered by SuperShop POS</p>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load, then print and close
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
};