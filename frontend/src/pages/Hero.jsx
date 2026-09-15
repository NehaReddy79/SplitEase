import { Link } from 'react-router-dom';
import './Hero.css';

export function Hero() {
    return (
        <div className="landing-page">
            <div className="landing-hero">
                <span className="landing-badge">Split bills</span>
                <h1>The simplest way to<br />split expenses with friends</h1>
                <p>
                    Track shared costs, see who owes what, and settle up in seconds 
                </p>
                <div className="landing-cta">
                    <Link to="/signup" className="cta-primary">Get started , it's free</Link>
                    <Link to="/login" className="cta-secondary">I already have an account</Link>
                </div>
            </div>

            <div className="landing-features">
                <div className="feature-card">
                    <div className="feature-icon">1</div>
                    <h3>Track every expense</h3>
                    <p>Split bills equally, by exact amount, or by percentage , whatever fits.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">2</div>
                    <h3>Auto-simplified settlements</h3>
                    <p>We calculate the fewest payments needed to settle up the whole group.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">3</div>
                    <h3>Real-time updates</h3>
                    <p>See new expenses and balance changes the moment they happen.</p>
                </div>
            </div>
        </div>
    );
}