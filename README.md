# Formly - Dynamic Form Builder & Response System

A modern, full-stack web application for creating, sharing, and collecting responses from dynamic forms. Built with React frontend and PHP backend, Formly provides an intuitive drag-and-drop interface for form creation with real-time analytics.

## 🚀 Features

### Form Builder
- **Drag-and-Drop Interface**: Intuitive form building with visual elements
- **Multiple Input Types**: Text inputs, text areas, radio buttons, checkboxes, and scale questions
- **Real-time Preview**: Preview forms as you build them
- **Element Configuration**: Customize labels, descriptions, validation rules, and options
- **Template System**: Pre-built templates for common form types (registration, feedback, etc.)

### User Management
- **Authentication System**: Secure login/signup with session management
- **Password Recovery**: Email-based OTP verification for password reset
- **User Profiles**: Manage personal information and preferences

### Form Management
- **Dashboard**: View all created forms with creation dates
- **Form Sharing**: Generate shareable links for form distribution
- **Response Collection**: Collect and store form responses
- **Analytics**: View response statistics and charts
- **Form Editing**: Update existing forms with new elements

### Response System
- **Public Forms**: Anyone with a link can respond to forms
- **Response Validation**: Client and server-side validation
- **Submission Confirmation**: User-friendly confirmation pages
- **Response Analytics**: Visual charts and statistics for form responses

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Chakra UI** - Component library for UI elements
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Recharts** - Chart library for analytics
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend
- **PHP** - Server-side scripting
- **MySQL** - Database management
- **PDO** - Database abstraction layer
- **PHPMailer** - Email functionality for OTP
- **Session Management** - User authentication

### Database Schema
- **users** - User accounts and authentication
- **forms** - Form metadata and ownership
- **form_questions** - Individual form elements
- **form_options** - Options for multiple choice questions
- **form_responses** - Submitted form responses
- **form_respondents** - Respondent information
- **otp_resets** - Password reset tokens

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PHP (v8.0 or higher)
- MySQL (v5.7 or higher)
- XAMPP/WAMP/MAMP (for local development)

### Backend Setup

1. **Database Configuration**
   ```bash
   # Import the database schema
   mysql -u root -p < feedback_db.sql
   ```

2. **PHP Configuration**
   ```bash
   cd Formly_Backend/feedback-api
   # Update database credentials in db.php
   ```

3. **Email Configuration** (for OTP functionality)
   - Configure SMTP settings in `send_otp.php`
   - Update email credentials for password reset functionality

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd Formly_Frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🚀 Usage Guide

### Creating Forms

1. **Access Form Builder**
   - Navigate to `/builder` after logging in
   - Use the sidebar to add form elements

2. **Add Form Elements**
   - **Text Input**: Single-line text fields
   - **Text Area**: Multi-line text fields
   - **Radio Buttons**: Single-choice options
   - **Checkboxes**: Multiple-choice options
   - **Scale Question**: Rating scales (1-5, 1-10, etc.)

3. **Configure Elements**
   - Set labels and descriptions
   - Mark fields as required
   - Add validation rules
   - Configure options for choice-based questions

4. **Preview and Save**
   - Use the preview button to test your form
   - Save the form to your dashboard

### Sharing Forms

1. **From Dashboard**
   - Click "Share" on any form
   - Copy the generated link
   - Share with respondents

2. **Form Templates**
   - Access pre-built templates via URL parameters
   - Example: `/builder?template=registration`

### Viewing Responses

1. **Analytics Dashboard**
   - Navigate to `/analytics`
   - View response statistics and charts
   - Filter by form and date range

2. **Individual Responses**
   - Access detailed response data
   - Export responses if needed

## 📁 Project Structure

```
formly-main/
├── Formly_Backend/
│   └── feedback-api/
│       ├── db.php                 # Database connection
│       ├── login.php              # User authentication
│       ├── signup.php             # User registration
│       ├── save_form.php          # Form creation/editing
│       ├── submit_response.php    # Response submission
│       ├── get_forms.php          # Form retrieval
│       ├── delete_form.php        # Form deletion
│       ├── send_otp.php           # Email OTP functionality
│       └── phpmailer/             # Email library
├── Formly_Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── elements/          # Form element components
│   │   │   ├── FormCanvas.jsx     # Main form builder
│   │   │   ├── Dashboard.jsx      # User dashboard
│   │   │   └── RespondForm.jsx    # Form response interface
│   │   ├── Pages/
│   │   │   ├── ResultAnalytics.jsx # Analytics dashboard
│   │   │   └── UserProfile.jsx    # User profile management
│   │   └── App.jsx                # Main application component
│   ├── package.json               # Frontend dependencies
│   └── vite.config.js             # Vite configuration
└── feedback_db.sql                # Database schema
```

## 🔧 Configuration

### Environment Variables
- Database credentials in `Formly_Backend/feedback-api/db.php`
- Email SMTP settings in `Formly_Backend/feedback-api/send_otp.php`
- API endpoints in frontend components

### Customization
- **Styling**: Modify Tailwind CSS classes in components
- **Form Elements**: Add new element types in `src/components/elements/`
- **Validation**: Update validation rules in form components
- **Analytics**: Customize charts in `ResultAnalytics.jsx`

## 🚀 Deployment

### Frontend Deployment
```bash
cd Formly_Frontend
npm run build
# Deploy dist/ folder to your web server
```

### Backend Deployment
- Upload `Formly_Backend/feedback-api/` to your PHP server
- Configure database connection
- Set up email SMTP settings
- Update CORS settings if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the code comments
- Review the database schema for data structure

## 🔮 Future Enhancements

- [ ] Advanced form validation rules
- [ ] File upload functionality
- [ ] Multi-language support
- [ ] Advanced analytics and reporting
- [ ] Form templates marketplace
- [ ] API documentation
- [ ] Mobile app development
- [ ] Real-time collaboration
- [ ] Advanced security features
- [ ] Integration with third-party services

---

**Formly** - Building forms made simple and powerful! 🎉
