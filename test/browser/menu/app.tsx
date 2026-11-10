import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import HeadMenu from '../../../packages/components/menu/HeadMenu';
import Menu from '../../../packages/components/menu/Menu';
import MenuItem from '../../../packages/components/menu/MenuItem';
import SubMenu from '../../../packages/components/menu/SubMenu';

function App() {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [dynamic, setDynamic] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <main>
      <h1>SubMenu height regression</h1>
      <div className="controls">
        <button
          id="sidebar-popup"
          onClick={() => {
            setCollapsed(true);
            setExpanded([]);
          }}
        >
          Collapse sidebar
        </button>
        <button id="sidebar-inline" onClick={() => setCollapsed(false)}>
          Restore sidebar
        </button>
        <button id="expand-l1" onClick={() => setExpanded(['1'])}>
          Open level 1
        </button>
        <button id="expand-l2" onClick={() => setExpanded(['1', '2'])}>
          Open level 2
        </button>
        <button id="expand-l3" onClick={() => setExpanded(['1', '2', '3'])}>
          Open level 3
        </button>
        <button id="close" onClick={() => setExpanded([])}>
          Close all
        </button>
        <button id="grow" onClick={() => setDynamic(true)}>
          Add content
        </button>
        <button id="huge" onClick={() => setExpanded(['huge'])}>
          Open long menu
        </button>
      </div>
      <div className="examples">
        <section id="inline">
          <h2>Nested / 90px items</h2>
          <Menu collapsed={collapsed} expanded={expanded} onExpand={setExpanded}>
            <SubMenu value="1" title="Level 1">
              <MenuItem value="first" style={{ height: 90 }}>
                First item
              </MenuItem>
              <SubMenu value="2" title="Level 2">
                <MenuItem value="second" style={{ height: 90 }}>
                  Second item
                </MenuItem>
                <SubMenu value="3" title="Level 3">
                  <MenuItem value="leaf" style={{ height: 90 }}>
                    Last nested item
                  </MenuItem>
                  {dynamic && (
                    <MenuItem value="dynamic" style={{ height: 300 }}>
                      Dynamic item
                    </MenuItem>
                  )}
                </SubMenu>
              </SubMenu>
            </SubMenu>
            <SubMenu value="huge" title="120 tall items">
              {Array.from({ length: 120 }, (_, i) => (
                <MenuItem key={i} value={`item-${i}`} style={{ height: 90 }}>
                  Long item {i}
                </MenuItem>
              ))}
            </SubMenu>
          </Menu>
        </section>
        <section id="popup">
          <h2>Controlled popup</h2>
          <Menu collapsed>
            <SubMenu
              value="popup"
              title="Popup"
              icon={<span>P</span>}
              popupProps={{ visible: true, overlayClassName: 'regression-popup' }}
            >
              <MenuItem value="popup-item" className="grow-item" style={{ height: 90 }}>
                Popup item
              </MenuItem>
            </SubMenu>
          </Menu>
        </section>
        <section id="head">
          <h2>Horizontal popup</h2>
          <HeadMenu expandType="popup">
            <SubMenu value="head" title="Head menu" popupProps={{ visible: true, overlayClassName: 'regression-head' }}>
              <MenuItem value="head-item" style={{ height: 90 }}>
                Head item
              </MenuItem>
            </SubMenu>
          </HeadMenu>
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
