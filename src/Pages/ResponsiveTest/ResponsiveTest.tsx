import React, { useState, useEffect } from 'react';
import './ResponsiveTest.less';

/**
 * 响应式测试页面
 * 用于测试和展示 rem 响应式效果
 */
const ResponsiveTest: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [rootFontSize, setRootFontSize] = useState('0px');
  const [deviceType, setDeviceType] = useState('');
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateInfo = () => {
      setWindowWidth(window.innerWidth);
      const fontSize = window.getComputedStyle(document.documentElement).fontSize;
      setRootFontSize(fontSize);
      const device = document.documentElement.getAttribute('data-device') || 'unknown';
      setDeviceType(device);
      setScale(parseFloat(fontSize) / 100);
    };

    updateInfo();
    window.addEventListener('resize', updateInfo);
    return () => window.removeEventListener('resize', updateInfo);
  }, []);

  return (
    <div className="responsive-test-page">
      {/* 信息面板 */}
      <div className="info-panel">
        <h1 className="title">📐 响应式 rem 测试页面</h1>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">屏幕宽度：</span>
            <span className="value">{windowWidth}px</span>
          </div>
          <div className="info-item">
            <span className="label">根字体大小：</span>
            <span className="value">{rootFontSize}</span>
          </div>
          <div className="info-item">
            <span className="label">设备类型：</span>
            <span className="value">{deviceType}</span>
          </div>
          <div className="info-item">
            <span className="label">缩放比例：</span>
            <span className="value">{scale.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* 测试区域 */}
      <div className="test-section">
        <h2 className="section-title">🎨 响应式元素测试</h2>

        {/* 固定宽度测试 */}
        <div className="test-group">
          <h3>1. 固定宽度盒子（200px → 2rem）</h3>
          <div className="box box-200">
            <p>宽度: 200px</p>
            <p>高度: 200px</p>
            <p className="small-text">会随屏幕等比缩放</p>
          </div>
        </div>

        {/* 不同尺寸测试 */}
        <div className="test-group">
          <h3>2. 不同尺寸盒子</h3>
          <div className="box-container">
            <div className="box box-100">100px</div>
            <div className="box box-200">200px</div>
            <div className="box box-300">300px</div>
            <div className="box box-400">400px</div>
          </div>
        </div>

        {/* 字体测试 */}
        <div className="test-group">
          <h3>3. 响应式字体</h3>
          <p className="text-12">12px 字体 (0.12rem)</p>
          <p className="text-14">14px 字体 (0.14rem)</p>
          <p className="text-16">16px 字体 (0.16rem)</p>
          <p className="text-20">20px 字体 (0.20rem)</p>
          <p className="text-24">24px 字体 (0.24rem)</p>
          <p className="text-32">32px 字体 (0.32rem)</p>
        </div>

        {/* 固定大小测试 */}
        <div className="test-group">
          <h3>4. 固定大小元素（使用大写 PX）</h3>
          <div className="fixed-box">
            <p>宽度: 200PX (固定)</p>
            <p>高度: 200PX (固定)</p>
            <p className="small-text">不会随屏幕缩放</p>
          </div>
        </div>

        {/* 混合使用测试 */}
        <div className="test-group">
          <h3>5. 混合使用（响应式 + 固定）</h3>
          <div className="mixed-box">
            <p>宽度: 300px (响应式)</p>
            <p>边框: 2PX (固定)</p>
            <p>内边距: 20px (响应式)</p>
          </div>
        </div>

        {/* 网格布局测试 */}
        <div className="test-group">
          <h3>6. 响应式网格布局</h3>
          <div className="grid-container">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <div key={num} className="grid-item">
                <p>卡片 {num}</p>
                <p className="small-text">200px × 150px</p>
              </div>
            ))}
          </div>
        </div>

        {/* 实际应用示例 */}
        <div className="test-group">
          <h3>7. 实际应用：卡片组件</h3>
          <div className="card-example">
            <div className="card-header">
              <h4 className="card-title">卡片标题 (24px)</h4>
              <span className="card-badge">NEW</span>
            </div>
            <div className="card-body">
              <p className="card-text">
                这是一个响应式卡片组件示例。所有的尺寸、字体、间距都会随着屏幕宽度等比缩放。
              </p>
              <p className="card-text">
                当前根字体大小：{rootFontSize}，缩放比例：{scale.toFixed(4)}
              </p>
            </div>
            <div className="card-footer">
              <button className="card-button">按钮 (120px × 40px)</button>
            </div>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="usage-section">
        <h2 className="section-title">📖 使用说明</h2>
        <div className="usage-content">
          <div className="usage-item">
            <strong>1. 响应式元素：</strong>
            <p>在 CSS 中直接写 px，会自动转换为 rem 并响应式缩放</p>
            <code>width: 200px; → width: 2rem;</code>
          </div>
          <div className="usage-item">
            <strong>2. 固定大小元素：</strong>
            <p>使用大写 PX，不会转换，保持固定大小</p>
            <code>width: 200PX; → width: 200px; (不转换)</code>
          </div>
          <div className="usage-item">
            <strong>3. 测试方法：</strong>
            <p>调整浏览器窗口大小，观察元素的缩放效果</p>
          </div>
          <div className="usage-item">
            <strong>4. 配置修改：</strong>
            <p>在 <code>src/common/Global/globalFontSize.ts</code> 中修改配置</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTest;

