import nodemailer from "nodemailer";

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendOrderConfirmationMail = async (toEmail, orderData) => {
  try {
    const transporter = getTransporter();
    const {
      orderId,
      date,
      items = [],
      subtotal = 0,
      discountAmount = 0,
      shippingCost = 0,
      estimatedTax = 0,
      grandTotal = 0,
      contactInfo = {},
      shippingAddress = {},
      paymentMethod = "Online Payment",
    } = orderData;

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #EFE8DF; font-size: 13px; color: #281C19;">
            <strong>${item.name}</strong><br/>
            <span style="font-size: 11px; color: #8A7973;">Qty: ${item.quantity} | Color: ${item.color || "Standard"}</span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #EFE8DF; font-size: 13px; color: #281C19; text-align: right;">
            ₹${(item.price * item.quantity).toLocaleString("en-IN")}
          </td>
        </tr>
      `
      )
      .join("");

    const addressText = shippingAddress.addressLine
      ? `${shippingAddress.fullName || contactInfo.name || ""}<br/>${shippingAddress.addressLine}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}<br/>Phone: ${shippingAddress.mobile || contactInfo.mobile || ""}`
      : "Address details on file";

    const mailOptions = {
      from: `"Nestro Furniture" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: `Order Confirmed! ${orderId} - Nestro Furniture`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 20px; color: #281C19;">
          <table width="100%" max-width="600" align="center" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #EFE8DF; overflow: hidden; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr>
              <td style="background-color: #3E2A24; padding: 24px; text-align: center;">
                <h1 style="color: #FAF7F2; margin: 0; font-size: 24px; letter-spacing: 3px; font-weight: bold;">NESTRO.</h1>
                <p style="color: #C4A484; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Handcrafted Luxury Furniture</p>
              </td>
            </tr>

            <!-- Body Banner -->
            <tr>
              <td style="padding: 24px 30px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #EFE8DF;">
                <div style="width: 50px; height: 50px; background-color: #FAF7F2; border: 2px solid #8C6239; border-radius: 50%; margin: 0 auto 12px auto; line-height: 50px; font-size: 24px; color: #8C6239;">✓</div>
                <h2 style="margin: 0; color: #281C19; font-size: 20px;">Thank you for your order!</h2>
                <p style="color: #8A7973; font-size: 13px; margin-top: 6px;">We have received your purchase and are preparing it for delivery.</p>
                <div style="background-color: #FAF7F2; padding: 12px 20px; border-radius: 8px; display: inline-block; margin-top: 14px; border: 1px solid #EFE8DF;">
                  <span style="font-size: 11px; color: #8A7973; text-transform: uppercase; letter-spacing: 1px;">Order Reference:</span>
                  <strong style="font-size: 14px; color: #8C6239; display: block;">${orderId}</strong>
                </div>
              </td>
            </tr>

            <!-- Order Summary Items -->
            <tr>
              <td style="padding: 24px 30px;">
                <h3 style="margin: 0 0 14px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #8C6239;">Items Ordered</h3>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  ${itemsHtml}
                </table>

                <!-- Price Calculations -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px; font-size: 13px; color: #8A7973;">
                  <tr>
                    <td style="padding: 4px 0;">Subtotal</td>
                    <td style="padding: 4px 0; text-align: right; color: #281C19; font-weight: bold;">₹${subtotal.toLocaleString("en-IN")}</td>
                  </tr>
                  ${
                    discountAmount > 0
                      ? `<tr>
                    <td style="padding: 4px 0; color: #8C6239;">Discount</td>
                    <td style="padding: 4px 0; text-align: right; color: #8C6239; font-weight: bold;">-₹${discountAmount.toLocaleString("en-IN")}</td>
                  </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding: 4px 0;">Shipping</td>
                    <td style="padding: 4px 0; text-align: right; color: #281C19; font-weight: bold;">${shippingCost === 0 ? "FREE" : `₹${shippingCost.toLocaleString("en-IN")}`}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0;">GST (18%)</td>
                    <td style="padding: 4px 0; text-align: right; color: #281C19; font-weight: bold;">₹${estimatedTax.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0 0 0; font-size: 15px; font-weight: bold; color: #281C19; border-top: 1px solid #EFE8DF;">Total Amount Paid</td>
                    <td style="padding: 10px 0 0 0; font-size: 16px; font-weight: bold; color: #8C6239; text-align: right; border-top: 1px solid #EFE8DF;">₹${grandTotal.toLocaleString("en-IN")}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Shipping & Payment Details -->
            <tr>
              <td style="padding: 0 30px 24px 30px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; border-radius: 12px; padding: 16px; border: 1px solid #EFE8DF;">
                  <tr>
                    <td width="50%" valign="top" style="font-size: 12px; color: #8A7973; padding-right: 10px;">
                      <strong style="color: #281C19; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; display: block; margin-bottom: 4px;">Delivery Address</strong>
                      ${addressText}
                    </td>
                    <td width="50%" valign="top" style="font-size: 12px; color: #8A7973; padding-left: 10px; border-left: 1px solid #EFE8DF;">
                      <strong style="color: #281C19; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; display: block; margin-bottom: 4px;">Payment Method</strong>
                      <span style="color: #8C6239; font-weight: bold;">${paymentMethod}</span><br/>
                      <span style="font-size: 11px; color: #8A7973;">Est. Delivery: 3 - 5 Business Days</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #FAF7F2; padding: 20px; text-align: center; font-size: 11px; color: #8A7973; border-top: 1px solid #EFE8DF;">
                <p style="margin: 0;">If you have any questions, contact us at <a href="mailto:support@nestro.com" style="color: #8C6239; text-decoration: underline;">support@nestro.com</a></p>
                <p style="margin: 6px 0 0 0;">© 2026 Nestro Furniture. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Order Confirmation Email Sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Order Mail Error:", error);
    return { success: false, error: error.message };
  }
};

export default sendOrderConfirmationMail;
