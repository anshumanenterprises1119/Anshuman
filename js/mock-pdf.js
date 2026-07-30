// DecorateNow - Client-Side Mock PDF Invoice Generator

const MockPDF = {
    generate(order) {
        if (!order) {
            console.error("No order details provided for invoice printing.");
            return;
        }

        // Create a printable iframe or popup window
        const printWindow = window.open('', '_blank', 'width=800,height=800');
        if (!printWindow) {
            window.showToast("Pop-up blocked! Please allow pop-ups to download invoice.", "warning");
            return;
        }

        const date = new Date(order.date);
        const formattedDate = date.toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        // Construct print document HTML
        const docHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8" />
                <title>Invoice - ${order.id}</title>
                <style>
                    body {
                        font-family: 'Montserrat', 'Helvetica', 'Arial', sans-serif;
                        color: #333;
                        margin: 0;
                        padding: 40px;
                        line-height: 1.6;
                    }
                    .invoice-container {
                        max-width: 800px;
                        margin: auto;
                    }
                    .header-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 40px;
                    }
                    .logo-cell {
                        font-size: 28px;
                        font-weight: bold;
                        color: #785a00;
                    }
                    .meta-cell {
                        text-align: right;
                        font-size: 14px;
                        color: #666;
                    }
                    .address-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 40px;
                        font-size: 14px;
                    }
                    .address-cell {
                        width: 50%;
                        vertical-align: top;
                    }
                    .items-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 40px;
                    }
                    .items-table th {
                        background-color: #f7ecdc;
                        color: #201b11;
                        font-weight: 600;
                        text-align: left;
                        padding: 12px;
                        font-size: 14px;
                        border-bottom: 2px solid #817660;
                    }
                    .items-table td {
                        padding: 12px;
                        font-size: 14px;
                        border-bottom: 1px solid #d3c5ac;
                    }
                    .totals-table {
                        width: 40%;
                        margin-left: auto;
                        border-collapse: collapse;
                        font-size: 14px;
                    }
                    .totals-table td {
                        padding: 8px 12px;
                    }
                    .totals-table tr.grand-total {
                        font-weight: bold;
                        font-size: 16px;
                        color: #785a00;
                        border-top: 2px solid #817660;
                    }
                    .footer {
                        margin-top: 80px;
                        text-align: center;
                        font-size: 12px;
                        color: #999;
                        border-top: 1px solid #d3c5ac;
                        padding-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <!-- Top header -->
                    <table class="header-table">
                        <tr>
                            <td class="logo-cell">DecorateNow</td>
                            <td class="meta-cell">
                                <strong>Tax Invoice</strong><br/>
                                Invoice ID: ${order.id}<br/>
                                Date: ${formattedDate}<br/>
                                Status: Paid
                            </td>
                        </tr>
                    </table>

                    <!-- Addresses -->
                    <table class="address-table">
                        <tr>
                            <td class="address-cell">
                                <strong>Seller Address:</strong><br/>
                                Anshuman Enterprises<br/>
                                Shop No. 2, Aimnabad<br/>
                                Greater Noida West - 201306<br/>
                                GSTIN: 09AWTPT8270E1ZQ
                            </td>
                            <td class="address-cell" style="padding-left: 20px;">
                                <strong>Billing & Shipping Address:</strong><br/>
                                ${order.shipping.fullname}<br/>
                                ${order.shipping.address1}<br/>
                                ${order.shipping.address2 ? order.shipping.address2 + '<br/>' : ''}
                                ${order.shipping.city}, ${order.shipping.state} - ${order.shipping.pincode}<br/>
                                Phone: +91 ${order.shipping.phone}
                            </td>
                        </tr>
                    </table>

                    <!-- Items Table -->
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Product Details</th>
                                <th style="text-align: right;">Unit Price</th>
                                <th style="text-align: center;">Qty</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>
                                        <strong>${item.name}</strong><br/>
                                        <span style="font-size: 12px; color: #666;">${item.details}</span>
                                    </td>
                                    <td style="text-align: right;">$${item.price.toFixed(2)}</td>
                                    <td style="text-align: center;">${item.quantity}</td>
                                    <td style="text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <!-- Calculations -->
                    <table class="totals-table">
                        <tr>
                            <td>Subtotal</td>
                            <td style="text-align: right;">$${order.pricing.subtotal.toFixed(2)}</td>
                        </tr>
                        ${order.pricing.discount > 0 ? `
                        <tr style="color: #785a00;">
                            <td>Discount</td>
                            <td style="text-align: right;">-$${order.pricing.discount.toFixed(2)}</td>
                        </tr>
                        ` : ''}
                        <tr>
                            <td>GST (18%)</td>
                            <td style="text-align: right;">$${order.pricing.tax.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Shipping</td>
                            <td style="text-align: right;">${order.pricing.shipping === 0 ? 'FREE' : '$' + order.pricing.shipping.toFixed(2)}</td>
                        </tr>
                        <tr class="grand-total">
                            <td>Grand Total</td>
                            <td style="text-align: right;">$${order.pricing.total.toFixed(2)}</td>
                        </tr>
                    </table>

                    <!-- Footer policy -->
                    <div class="footer">
                        Thank you for shopping with DecorateNow!<br/>
                        For return requests or support queries, contact anshumanenterprises1119@gmail.com.<br/>
                        Phone: +91 7085815743<br/>
                        This is a computer-generated tax invoice and requires no physical signature.
                    </div>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                    };
                <\/script>
            </body>
            </html>
        `;

        printWindow.document.write(docHtml);
        printWindow.document.close();
        window.showToast("Invoice opened in new printable tab!", "success");
    }
};

window.MockPDF = MockPDF;
