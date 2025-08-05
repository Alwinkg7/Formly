import { useNavigate } from 'react-router-dom';  
import { 
  ArrowRight, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Shield, 
  Zap, 
  Star,
  TrendingUp,
  Globe,
  Clock,
  Target,
  Github,
  Linkedin,
  FileText
} from 'lucide-react';
import './home.css';


function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navigation */}
      

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Collect Feedback,
            <span className="hero-gradient-text"> Drive Growth</span>
          </h1>
          <p className="hero-subtitle">
            Create beautiful feedback forms, gather valuable insights, and make data-driven decisions with our powerful analytics platform trusted by thousands of organizations worldwide.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary btn-large" onClick={() => navigate('/signup')}>
              Create Forms
              <ArrowRight size={20} />
            </button>
          </div>
          <p className="hero-note">Free Forever • No credit card required</p>
        </div>
        
        {/* Floating Elements */}
        <div className="floating-element floating-1"><FileText size={50}/></div>
        <div className="floating-element floating-2"><FileText size={50}/></div>
      </section>

      {/* Features Section */}
      <section id="features" className="section section-gray">
        <div className="hmcontainer">
          <div className="text-center">
            <h2 className="section-title">Everything you need to succeed</h2>
            <p className="section-subtitle">
              Powerful features designed to help you create, collect, and analyze feedback effortlessly
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon icon-blue">
                <Zap size={24} />
              </div>
              <h3 className="feature-title">Lightning Fast Setup</h3>
              <p className="feature-description">Create professional feedback forms in minutes with no coding required.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-green">
                <BarChart3 size={24} />
              </div>
              <h3 className="feature-title">Real-time Analytics</h3>
              <p className="feature-description">Get instant insights with beautiful charts, trends, and actionable data visualizations.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-purple">
                <Users size={24} />
              </div>
              <h3 className="feature-title">Team Collaboration</h3>
              <p className="feature-description">Work together with your team, share insights, and make decisions collaboratively.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-orange">
                <Shield size={24} />
              </div>
              <h3 className="feature-title">Enterprise Security</h3>
              <p className="feature-description">Bank-level security with GDPR compliance, SSL encryption, and data protection.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-red">
                <Globe size={24} />
              </div>
              <h3 className="feature-title">Global Reach</h3>
              <p className="feature-description">Multi-language support and global CDN ensure your forms work everywhere.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-indigo">
                <Target size={24} />
              </div>
              <h3 className="feature-title">Smart Targeting</h3>
              <p className="feature-description">Advanced logic and targeting rules to show the right questions to the right people.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="hmcontainer">
          <div className="text-center">
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">Get started in three simple steps</p>
          </div>

          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3 className="step-title">Create Your Form</h3>
              <p className="step-description">Use our intuitive builder to create beautiful, branded feedback forms in minutes.</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3 className="step-title">Collect Responses</h3>
              <p className="step-description">Share your form via email, social media, or embed it directly on your website.</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3 className="step-title">Analyze & Act</h3>
              <p className="step-description">View real-time analytics, generate reports, and make data-driven decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Dashboard Preview */}
      <section id="analytics" className="section analytics-section">
        <div className="hmcontainer">
          <div className="text-center">
            <h2 className="section-title">Powerful Analytics Dashboard</h2>
            <p className="section-subtitle">Transform feedback into actionable insights with our comprehensive analytics</p>
          </div>

          <div className="dashboard-preview">
            <div className="stats-grid">
              <div className="stat-card stat-card-blue">
                <div className="stat-header">
                  <TrendingUp size={32} />
                  <span className="stat-change">+12.5%</span>
                </div>
                <h3 className="stat-value">2,847</h3>
                <p className="stat-label">Total Responses</p>
              </div>

              <div className="stat-card stat-card-green">
                <div className="stat-header">
                  <Star size={32} />
                  <span className="stat-change">+5.2%</span>
                </div>
                <h3 className="stat-value">4.8/5</h3>
                <p className="stat-label">Avg. Rating</p>
              </div>

              <div className="stat-card stat-card-purple">
                <div className="stat-header">
                  <Clock size={32} />
                  <span className="stat-change">-2.1%</span>
                </div>
                <h3 className="stat-value">2m 14s</h3>
                <p className="stat-label">Avg. Time</p>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-container">
                <h4 className="chart-title">Response Trends</h4>
                <div className="chart-placeholder">
                  <BarChart3 size={48} color="#d1d5db" />
                  <p>Interactive Chart Preview</p>
                </div>
              </div>

              <div className="chart-container">
                <h4 className="chart-title">Recent Feedback</h4>
                <div>
                  <div className="feedback-item">
                    <div className="feedback-header">
                      <span className="feedback-name">Sarah Johnson</span>
                      <div className="stars">
                        {[1,2,3,4,5].map(i => <Star key={i} className="star" size={16} fill="currentColor" />)}
                      </div>
                    </div>
                    <p className="feedback-text">"Excellent service and very user-friendly interface!"</p>
                  </div>
                  <div className="feedback-item">
                    <div className="feedback-header">
                      <span className="feedback-name">Mike Chen</span>
                      <div className="stars">
                        {[1,2,3,4].map(i => <Star key={i} className="star" size={16} fill="currentColor" />)}
                        <Star className="star star-empty" size={16} />
                      </div>
                    </div>
                    <p className="feedback-text">"Great tool, would love to see more customization options."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="hmcontainer">
          <div className="text-center">
            <h2 className="section-title">Trusted by thousands</h2>
            <p className="section-subtitle">See what our customers are saying about Formly</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial">
              <div className="testimonial-stars">
                {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              <p className="testimonial-text">"Formly transformed how we collect and analyze customer feedback. The insights have been invaluable for our product development."</p>
              <div className="testimonial-author">
                <div className="author-avatar avatar-blue">JD</div>
                <div>
                  <p className="author-name">John Davis</p>
                  <p className="author-title">CEO, TechCorp</p>
                </div>
              </div>
            </div>

            <div className="testimonial">
              <div className="testimonial-stars">
                {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              <p className="testimonial-text">"The analytics dashboard is incredibly detailed yet easy to understand. We've improved our customer satisfaction by 40%."</p>
              <div className="testimonial-author">
                <div className="author-avatar avatar-green">AL</div>
                <div>
                  <p className="author-name">Amanda Lee</p>
                  <p className="author-title">Marketing Director, GrowthCo</p>
                </div>
              </div>
            </div>

            <div className="testimonial">
              <div className="testimonial-stars">
                {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              <p className="testimonial-text">"Setting up feedback forms is so easy, and the real-time responses help us make quick decisions. Highly recommended!"</p>
              <div className="testimonial-author">
                <div className="author-avatar avatar-purple">RK</div>
                <div>
                  <p className="author-name">Robert Kim</p>
                  <p className="author-title">Product Manager, InnovateLab</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Build once, share everywhere</h2>
          <p className="cta-subtitle">Reach your audience the right way</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <div className="logo">
                  <div className="logo-icon">
                    <FileText size={20} color="white" />
                  </div>
                  <span className="logo-text">Formly</span>
                </div>
              </div>
              <p className="footer-description">Empowering organizations with intelligent feedback solutions and actionable insights.</p>
              <div className="social-links">
                <div className="social-link">
                  <Github/>
                </div>
                <div className="social-link">
                  <Linkedin />
                </div>
              </div>
            </div>

            <div>
              <h3 className="footer-section-title">Product</h3>
              <ul className="footer-links">
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Integrations</a></li>
                <li><a href="#">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="footer-section-title">Company</h3>
              <ul className="footer-links">
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">© 2024 Formly. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;