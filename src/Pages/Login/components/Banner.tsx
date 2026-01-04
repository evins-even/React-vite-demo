// Banner.tsx
import '../style/banner.less'

function Banner() {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="banner">
            <div
                className={`flip-card ${isFlipped ? 'flipped' : ''}`}
                onClick={handleClick}
            >
                <div className="card-face front">
                    <h3 className="card-face-title">正面</h3>
                    <p className="card-face-content">点击翻转卡片</p>
                </div>
                <div className="card-face back">
                    <h3 className="card-face-title">背面</h3>
                    <p className="card-face-content">这是背面内容</p>
                </div>
            </div>
        </div>
    );
}

export default Banner;