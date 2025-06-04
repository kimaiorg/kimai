import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    // Hardcoded email credentials
    const emailAuthor = 'ddhuu.dev@gmail.com';
    const emailPassword = 'eoxj pvqx rkhp zvew';
    
    this.logger.log(`Initializing email service with sender: ${emailAuthor}`);
    
    // Create reusable transporter object using SMTP transport
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailAuthor,
        pass: emailPassword,
      },
    });
    
    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error(`Email service initialization failed: ${error.message}`);
        this.logger.error(`Error details: ${JSON.stringify(error)}`);
      } else {
        this.logger.log('Email service ready to send messages');
      }
    });
  }

  /**
   * Send an email to a customer with invoice details
   * @param to Customer email address
   * @param subject Email subject
   * @param invoiceData Invoice data to include in the email
   * @param senderInfo Optional information about the sender (user ID, name)
   * @returns Promise with the result of sending the email
   */
  async sendInvoiceEmail(
    to: string, 
    subject: string, 
    invoiceData: any, 
    senderInfo?: { userId?: number | string; userName?: string }
  ): Promise<any> {
    const startTime = new Date();
    const sender = senderInfo?.userName || `User ID: ${senderInfo?.userId || 'Unknown'}`;
    
    this.logger.log(`[EMAIL] Attempting to send invoice email from ${sender} to customer: ${to}`);
    this.logger.log(`[EMAIL] Invoice #${invoiceData.invoiceNumber || invoiceData.id} for customer ID: ${invoiceData.customer?.id || 'Unknown'}`);
    
    try {
      // Format invoice data for email
      const invoiceDate = new Date(invoiceData.date).toLocaleDateString();
      const dueDate = new Date(invoiceData.dueDate).toLocaleDateString();
      
      const formattedSubtotal = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: invoiceData.currency || 'USD',
      }).format(invoiceData.subtotalAmount || 0);
      
      const formattedTax = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: invoiceData.currency || 'USD',
      }).format(invoiceData.taxAmount || 0);
      
      const formattedTotal = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: invoiceData.currency || 'USD',
      }).format(invoiceData.totalAmount || invoiceData.totalPrice);

      // Generate HTML table for invoice items
      let itemsTableHtml = '';
      if (invoiceData.items && Array.isArray(invoiceData.items) && invoiceData.items.length > 0) {
        this.logger.log(`[EMAIL] Generating table for ${invoiceData.items.length} invoice items`);
        
        itemsTableHtml = `
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f8f9fa; text-align: left;">
                <th style="padding: 10px; border: 1px solid #dee2e6;">Description</th>
                <th style="padding: 10px; border: 1px solid #dee2e6;">Quantity</th>
                <th style="padding: 10px; border: 1px solid #dee2e6;">Unit Price</th>
                <th style="padding: 10px; border: 1px solid #dee2e6;">Total</th>
              </tr>
            </thead>
            <tbody>
        `;
        
        invoiceData.items.forEach((item, index) => {
          this.logger.log(`[EMAIL] Processing item ${index + 1}: ${JSON.stringify(item)}`);
          
          const unitPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: invoiceData.currency || 'USD',
          }).format(item.unitPrice);
          
          const itemTotal = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: invoiceData.currency || 'USD',
          }).format(item.totalPrice);
          
          itemsTableHtml += `
            <tr>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${item.description || 'No description'}</td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${item.quantity || 0}</td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${unitPrice}</td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${itemTotal}</td>
            </tr>
          `;
        });
        
        itemsTableHtml += `
            </tbody>
            <tfoot>
              <tr style="background-color: #f8f9fa; font-weight: bold;">
                <td colspan="3" style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">Subtotal:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${formattedSubtotal}</td>
              </tr>
              <tr style="background-color: #f8f9fa; font-weight: bold;">
                <td colspan="3" style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">Tax:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${formattedTax}</td>
              </tr>
              <tr style="background-color: #f8f9fa; font-weight: bold;">
                <td colspan="3" style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">Total:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${formattedTotal}</td>
              </tr>
            </tfoot>
          </table>
        `;
        
        this.logger.log(`[EMAIL] Items table HTML generated successfully`);
      } else {
        this.logger.warn(`[EMAIL] No items found in invoice data or items is not an array`);
        itemsTableHtml = '<p>No items found in this invoice.</p>';
      }

      // Create HTML content for the email
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <div style="text-align: center; padding: 15px; background-color: #f8f9fa; border-bottom: 3px solid #007bff;">
            <h2>Invoice Notification</h2>
          </div>
          
          <div style="padding: 20px;">
            <p>Dear ${invoiceData.customer?.name || 'Valued Customer'},</p>
            
            <p>We are writing to inform you that a new invoice has been generated for your account.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #007bff;">
              <h3 style="margin-top: 0;">Invoice Details</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px 0;"><strong>Invoice Number:</strong></td>
                  <td style="padding: 5px 0;">${invoiceData.invoiceNumber || invoiceData.id}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Date:</strong></td>
                  <td style="padding: 5px 0;">${invoiceDate}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Due Date:</strong></td>
                  <td style="padding: 5px 0;">${dueDate}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Status:</strong></td>
                  <td style="padding: 5px 0;"><span style="background-color: ${invoiceData.status === 'PAID' ? '#28a745' : '#ffc107'}; color: ${invoiceData.status === 'PAID' ? 'white' : 'black'}; padding: 3px 8px; border-radius: 3px;">${invoiceData.status}</span></td>
                </tr>
              </table>
            </div>
            
            <div style="margin: 30px 0;">
              <h3>Invoice Items</h3>
              ${itemsTableHtml}
            </div>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="margin-top: 0;">Payment Information</h3>
              <p><strong>Subtotal:</strong> ${formattedSubtotal}</p>
              <p><strong>Tax:</strong> ${formattedTax}</p>
              <p><strong>Total Amount Due:</strong> ${formattedTotal}</p>
              <p><strong>Currency:</strong> ${invoiceData.currency || 'USD'}</p>
              <p><strong>Payment Terms:</strong> Due by ${dueDate}</p>
            </div>
            
            <div style="margin: 30px 0;">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${invoiceData.customer?.name || 'N/A'}</p>
              <p><strong>Email:</strong> ${invoiceData.customer?.email || 'N/A'}</p>
              ${invoiceData.customer?.address ? `<p><strong>Address:</strong> ${invoiceData.customer.address}</p>` : ''}
              ${invoiceData.customer?.phone ? `<p><strong>Phone:</strong> ${invoiceData.customer.phone}</p>` : ''}
            </div>
            
            <p>Please review the invoice details and process the payment at your earliest convenience.</p>
            
            <p>If you have any questions or concerns regarding this invoice, please don't hesitate to contact us.</p>
            
            <p>Thank you for your business!</p>
            
            <p>Best regards,<br>Finance Department</p>
          </div>
          
          <div style="text-align: center; padding: 10px; background-color: #f8f9fa; font-size: 12px; color: #6c757d; border-top: 1px solid #dee2e6; margin-top: 20px;">
            <p>This is an automated email. Please do not reply directly to this message.</p>
            <p> 2023 Kimai. All rights reserved.</p>
          </div>
        </div>
      `;

      // Send email
      const info = await this.transporter.sendMail({
        from: `"Invoice Service" <ddhuu.dev@gmail.com>`,
        to: to,
        subject: subject || `Invoice #${invoiceData.invoiceNumber || invoiceData.id} Generated`,
        html: htmlContent,
      });

      const endTime = new Date();
      const duration = (endTime.getTime() - startTime.getTime()) / 1000;
      
      this.logger.log(`[EMAIL] Email sent successfully from ${sender} to ${to}`);
      this.logger.log(`[EMAIL] Message ID: ${info.messageId}`);
      this.logger.log(`[EMAIL] Delivery took ${duration.toFixed(2)} seconds`);
      
      return {
        success: true,
        messageId: info.messageId,
        sender: sender,
        recipient: to,
        sentAt: new Date().toISOString(),
        duration: `${duration.toFixed(2)}s`,
      };
    } catch (error) {
      const endTime = new Date();
      const duration = (endTime.getTime() - startTime.getTime()) / 1000;
      
      this.logger.error(`[EMAIL] Error sending email from ${sender} to ${to}: ${error.message}`);
      this.logger.error(`[EMAIL] Failed after ${duration.toFixed(2)} seconds`);
      this.logger.error(`[EMAIL] Error details: ${JSON.stringify(error)}`);
      
      return {
        success: false,
        error: error.message,
        sender: sender,
        recipient: to,
        attemptedAt: new Date().toISOString(),
        duration: `${duration.toFixed(2)}s`,
      };
    }
  }

  /**
   * Send a test email to verify the email service is working
   * @param to Email address to send the test to
   * @param senderInfo Optional information about the sender (user ID, name)
   * @returns Promise with the result of sending the email
   */
  async sendTestEmail(
    to: string,
    senderInfo?: { userId?: number | string; userName?: string }
  ): Promise<any> {
    const startTime = new Date();
    const sender = senderInfo?.userName || `User ID: ${senderInfo?.userId || 'Unknown'}`;
    
    this.logger.log(`[EMAIL] Attempting to send test email from ${sender} to: ${to}`);
    
    try {
      const info = await this.transporter.sendMail({
        from: `"Invoice Service" <ddhuu.dev@gmail.com>`,
        to: to,
        subject: 'Test Email from Invoice Service',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
            <h2>Test Email</h2>
            <p>This is a test email from the Invoice Service.</p>
            <p>If you received this email, the email service is working correctly.</p>
            <p>Time sent: ${new Date().toLocaleString()}</p>
            <p>Sent by: ${sender}</p>
          </div>
        `,
      });

      const endTime = new Date();
      const duration = (endTime.getTime() - startTime.getTime()) / 1000;
      
      this.logger.log(`[EMAIL] Test email sent successfully from ${sender} to ${to}`);
      this.logger.log(`[EMAIL] Message ID: ${info.messageId}`);
      this.logger.log(`[EMAIL] Delivery took ${duration.toFixed(2)} seconds`);
      
      return {
        success: true,
        messageId: info.messageId,
        sender: sender,
        recipient: to,
        sentAt: new Date().toISOString(),
        duration: `${duration.toFixed(2)}s`,
      };
    } catch (error) {
      const endTime = new Date();
      const duration = (endTime.getTime() - startTime.getTime()) / 1000;
      
      this.logger.error(`[EMAIL] Error sending test email from ${sender} to ${to}: ${error.message}`);
      this.logger.error(`[EMAIL] Failed after ${duration.toFixed(2)} seconds`);
      this.logger.error(`[EMAIL] Error details: ${JSON.stringify(error)}`);
      
      return {
        success: false,
        error: error.message,
        sender: sender,
        recipient: to,
        attemptedAt: new Date().toISOString(),
        duration: `${duration.toFixed(2)}s`,
      };
    }
  }
}
