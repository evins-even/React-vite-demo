import React, { useState } from 'react';
import { InputNumber, Button, Message } from '@arco-design/web-react';
import { presetConfigs, ResponsiveConfig } from '../Global/responsiveConfig';
import setRootFontSize from '../Global/globalFontSize';
import './ResponsiveConfigSwitcher.less';

/**
 * 响应式配置切换器组件
 * 用于在开发时快速切换不同的响应式配置
 */
const ResponsiveConfigSwitcher: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<ResponsiveConfig>({
    baseSize: 100,
    designWidth: 1920,
    minSize: 20,
    maxSize: 200,
    debounceTime: 300,
  });

  // 应用预设配置
  const applyPreset = (presetName: keyof typeof presetConfigs) => {
    const preset = presetConfigs[presetName];
    setConfig(preset);
    Message.success(`已切换到 ${presetName} 配置`);
  };

  // 应用自定义配置
  const applyCustomConfig = () => {
    // 这里只是演示，实际需要修改 responsiveConfig.ts 文件
    Message.info('自定义配置需要修改 responsiveConfig.ts 文件后重启项目');
    console.log('当前配置：', config);
  };

  // 刷新根字体大小
  const refreshFontSize = () => {
    setRootFontSize();
    Message.success('已刷新根字体大小');
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <div className="config-switcher-fab" onClick={() => setVisible(!visible)}>
        ⚙️
      </div>

      {/* 配置面板 */}
      {visible && (
        <div className="config-switcher-panel">
          <div className="panel-header">
            <h3>响应式配置</h3>
            <button className="close-btn" onClick={() => setVisible(false)}>
              ✕
            </button>
          </div>

          <div className="panel-body">
            {/* 预设配置 */}
            <div className="config-section">
              <h4>预设配置</h4>
              <div className="preset-buttons">
                <Button
                  type="primary"
                  onClick={() => applyPreset('desktop')}
                  style={{ marginRight: 8, marginBottom: 8 }}
                >
                  PC 端 (1920px)
                </Button>
                <Button
                  type="primary"
                  onClick={() => applyPreset('mobile')}
                  style={{ marginRight: 8, marginBottom: 8 }}
                >
                  移动端 (375px)
                </Button>
                <Button
                  type="primary"
                  onClick={() => applyPreset('tablet')}
                  style={{ marginRight: 8, marginBottom: 8 }}
                >
                  平板 (768px)
                </Button>
                <Button
                  type="primary"
                  onClick={() => applyPreset('responsive')}
                  style={{ marginBottom: 8 }}
                >
                  响应式 (推荐)
                </Button>
              </div>
            </div>

            {/* 当前配置 */}
            <div className="config-section">
              <h4>当前配置</h4>
              <div className="config-item">
                <label>基准字体 (baseSize):</label>
                <InputNumber
                  value={config.baseSize}
                  onChange={(value) => setConfig({ ...config, baseSize: value || 100 })}
                  min={10}
                  max={200}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="config-item">
                <label>设计稿宽度 (designWidth):</label>
                <InputNumber
                  value={config.designWidth}
                  onChange={(value) => setConfig({ ...config, designWidth: value || 1920 })}
                  min={320}
                  max={3840}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="config-item">
                <label>最小字体 (minSize):</label>
                <InputNumber
                  value={config.minSize}
                  onChange={(value) => setConfig({ ...config, minSize: value || 10 })}
                  min={10}
                  max={100}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="config-item">
                <label>最大字体 (maxSize):</label>
                <InputNumber
                  value={config.maxSize}
                  onChange={(value) => setConfig({ ...config, maxSize: value || 200 })}
                  min={100}
                  max={500}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="config-item">
                <label>防抖时间 (debounceTime):</label>
                <InputNumber
                  value={config.debounceTime}
                  onChange={(value) => setConfig({ ...config, debounceTime: value || 300 })}
                  min={0}
                  max={1000}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="config-section">
              <Button
                type="primary"
                long
                onClick={applyCustomConfig}
                style={{ marginBottom: 8 }}
              >
                应用自定义配置
              </Button>
              <Button
                type="outline"
                long
                onClick={refreshFontSize}
              >
                刷新根字体大小
              </Button>
            </div>

            {/* 说明 */}
            <div className="config-section">
              <div className="config-note">
                <p>💡 提示：</p>
                <ul>
                  <li>baseSize 必须与 vite.config.js 的 rootValue 一致</li>
                  <li>designWidth 应该与设计稿宽度一致</li>
                  <li>修改配置后需要在 responsiveConfig.ts 中保存</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResponsiveConfigSwitcher;

