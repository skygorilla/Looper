// Popup script for Looper v2 - Inject Real Component
document.addEventListener('DOMContentLoaded', function() {
  const togglePanelBtn = document.getElementById('togglePanel');
  const refreshPageBtn = document.getElementById('refreshPage');
  const panelStatusEl = document.getElementById('panelStatus');
  const targetStatusEl = document.getElementById('targetStatus');

  // Auto-open panel when popup opens
  openLooperPanel();

  // Toggle panel button
  togglePanelBtn.addEventListener('click', openLooperPanel);

  // Refresh page button
  refreshPageBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
      window.close();
    });
  });

  // Open Looper panel function
  function openLooperPanel() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tabId = tabs[0].id;
      
      // Inject the actual LooperAutopilotAdvanced component
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: function() {
          // Remove existing panel if any
          const existing = document.getElementById('looper-autopilot-root');
          if (existing) existing.remove();
          
          // Create React root container
          const rootContainer = document.createElement('div');
          rootContainer.id = 'looper-autopilot-root';
          rootContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 999999;
            pointer-events: none;
          `;
          
          document.body.appendChild(rootContainer);
          
          // Load React and required dependencies
          const loadScript = (src) => {
            return new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = src;
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
            });
          };
          
          const loadCSS = (href) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
          };
          
          // Load dependencies and render the actual component
          Promise.all([
            loadScript('https://unpkg.com/react@18/umd/react.production.min.js'),
            loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'),
            loadScript('https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js')
          ]).then(() => {
            // Load Tailwind CSS
            loadCSS('https://cdn.tailwindcss.com');
            
            // Create the actual LooperAutopilotAdvanced component
            const LooperComponent = React.createElement('div', {
              className: 'relative grid grid-cols-[auto_1fr_auto] grid-rows-1 gap-5 items-center justify-items-center p-5 transform scale-90',
              style: { pointerEvents: 'auto' }
            }, [
              // Left tabs
              React.createElement('div', {
                key: 'left',
                className: 'col-start-1 flex flex-col gap-5 justify-self-end'
              }, [
                React.createElement('div', {
                  key: 'devtools',
                  className: 'relative cursor-pointer transition-all duration-400 ease-in-out w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] hover:scale-105 z-10'
                }, [
                  React.createElement('svg', {
                    key: 'icon',
                    width: 24,
                    height: 24,
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: '#9ca3af',
                    strokeWidth: 2
                  }, [
                    React.createElement('polyline', { key: 'p1', points: '4,17 10,11 4,5' }),
                    React.createElement('line', { key: 'l1', x1: 12, y1: 19, x2: 20, y2: 19 })
                  ])
                ])
              ]),
              
              // Central panel
              React.createElement('div', {
                key: 'center',
                className: 'col-start-2'
              }, [
                React.createElement('div', {
                  key: 'panel',
                  className: 'w-[300px] h-[652px] p-7 rounded-[60px] bg-gradient-to-b from-[#353A40] to-[#16171B] shadow-2xl flex flex-col font-sans relative'
                }, [
                  // Close button
                  React.createElement('button', {
                    key: 'close',
                    className: 'absolute top-[-50px] right-[-50px] w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] hover:scale-105 transition-all duration-200',
                    onClick: () => document.getElementById('looper-autopilot-root').remove()
                  }, [
                    React.createElement('svg', {
                      key: 'x',
                      width: 18,
                      height: 18,
                      viewBox: '0 0 24 24',
                      fill: 'none',
                      stroke: '#9ca3af',
                      strokeWidth: 2
                    }, [
                      React.createElement('line', { key: 'l1', x1: 18, y1: 6, x2: 6, y2: 18 }),
                      React.createElement('line', { key: 'l2', x1: 6, y1: 6, x2: 18, y2: 18 })
                    ])
                  ]),
                  
                  // Header
                  React.createElement('div', {
                    key: 'header',
                    className: 'text-center mb-6'
                  }, [
                    React.createElement('div', {
                      key: 'title',
                      className: 'text-white font-semibold mb-3'
                    }, 'Looper v2'),
                    React.createElement('div', {
                      key: 'status',
                      className: 'text-xs uppercase tracking-wider text-slate-400'
                    }, 'Ready')
                  ]),
                  
                  // Stats
                  React.createElement('div', {
                    key: 'stats',
                    className: 'bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] rounded-2xl p-5 mb-6 shadow-[inset_14px_14px_40px_rgba(16,16,18,0.75),inset_-7px_-7px_30px_#262E32]'
                  }, [
                    React.createElement('div', {
                      key: 'counters',
                      className: 'flex justify-around items-center'
                    }, [
                      React.createElement('div', {
                        key: 'session',
                        className: 'text-center'
                      }, [
                        React.createElement('div', {
                          key: 'label',
                          className: 'text-xs uppercase text-slate-400 tracking-wider'
                        }, 'Session'),
                        React.createElement('div', {
                          key: 'count',
                          className: 'text-2xl font-semibold text-white'
                        }, '0')
                      ]),
                      React.createElement('div', {
                        key: 'divider',
                        className: 'w-0.5 h-8 bg-gradient-to-b from-[#16171B] to-[#353A40] rounded-full'
                      }),
                      React.createElement('div', {
                        key: 'total',
                        className: 'text-center'
                      }, [
                        React.createElement('div', {
                          key: 'label',
                          className: 'text-xs uppercase text-slate-400 tracking-wider'
                        }, 'Total'),
                        React.createElement('div', {
                          key: 'count',
                          className: 'text-2xl font-semibold text-white'
                        }, '0')
                      ])
                    ])
                  ]),
                  
                  // Control buttons
                  React.createElement('div', {
                    key: 'controls',
                    className: 'mb-5'
                  }, [
                    React.createElement('div', {
                      key: 'buttons',
                      className: 'flex gap-2.5 mb-3'
                    }, [
                      React.createElement('button', {
                        key: 'play',
                        className: 'flex-1 h-14 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] transition-all duration-200 border-none cursor-pointer flex items-center justify-center',
                        onClick: () => {
                          const textarea = document.getElementById('starterPrompt');
                          if (textarea) {
                            textarea.value = 'scan app and do not change anithing';
                            textarea.focus();
                          }
                        }
                      }, [
                        React.createElement('svg', {
                          key: 'icon',
                          width: 20,
                          height: 20,
                          viewBox: '0 0 24 24',
                          fill: 'none',
                          stroke: '#3b82f6',
                          strokeWidth: 2
                        }, [
                          React.createElement('polygon', { key: 'p', points: '5,3 19,12 5,21' })
                        ])
                      ]),
                      React.createElement('button', {
                        key: 'pause',
                        className: 'flex-1 h-14 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] transition-all duration-200 border-none cursor-pointer flex items-center justify-center'
                      }, [
                        React.createElement('svg', {
                          key: 'icon',
                          width: 20,
                          height: 20,
                          viewBox: '0 0 24 24',
                          fill: 'none',
                          stroke: '#f59e0b',
                          strokeWidth: 2
                        }, [
                          React.createElement('rect', { key: 'r1', x: 6, y: 4, width: 4, height: 16 }),
                          React.createElement('rect', { key: 'r2', x: 14, y: 4, width: 4, height: 16 })
                        ])
                      ]),
                      React.createElement('button', {
                        key: 'reset',
                        className: 'flex-1 h-14 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] transition-all duration-200 border-none cursor-pointer flex items-center justify-center'
                      }, [
                        React.createElement('svg', {
                          key: 'icon',
                          width: 20,
                          height: 20,
                          viewBox: '0 0 24 24',
                          fill: 'none',
                          stroke: '#10b981',
                          strokeWidth: 2
                        }, [
                          React.createElement('polyline', { key: 'p', points: '1,4 1,10 7,10' }),
                          React.createElement('path', { key: 'path', d: 'M3.51,15a9,9,0,0,0,13.48,0' })
                        ])
                      ])
                    ])
                  ]),
                  
                  // Textarea
                  React.createElement('textarea', {
                    key: 'textarea',
                    id: 'starterPrompt',
                    className: 'w-full flex-grow p-4 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[inset_12px_12px_24px_rgba(16,16,18,0.75),inset_-12px_-12px_24px_#262E32] text-white text-sm resize-none mb-5 border-none outline-none',
                    placeholder: '🤖 Smart Analysis Mode: Analyzing current page context...',
                    spellCheck: false
                  }),
                  
                  // Inject button
                  React.createElement('div', {
                    key: 'inject',
                    className: 'flex gap-2.5'
                  }, [
                    React.createElement('button', {
                      key: 'btn',
                      className: 'flex-1 h-14 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] transition-all duration-200 border-none cursor-pointer flex items-center justify-center',
                      onClick: () => {
                        const target = document.getElementById('starterPrompt');
                        if (target && target.value.trim()) {
                          const event = new Event('input', { bubbles: true });
                          target.dispatchEvent(event);
                        }
                      }
                    }, [
                      React.createElement('svg', {
                        key: 'icon',
                        width: 20,
                        height: 20,
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: '#10b981',
                        strokeWidth: 2
                      }, [
                        React.createElement('polygon', { key: 'p', points: '13,2 3,14 12,14 11,22 21,10 12,10 13,2' })
                      ])
                    ])
                  ]),
                  
                  // Footer
                  React.createElement('div', {
                    key: 'footer',
                    className: 'text-center text-xs text-slate-500 mt-auto'
                  }, 'Looper Autopilot v2')
                ])
              ]),
              
              // Right tabs
              React.createElement('div', {
                key: 'right',
                className: 'col-start-3 flex flex-col gap-5 justify-self-start'
              }, [
                React.createElement('div', {
                  key: 'full-scan',
                  className: 'relative cursor-pointer transition-all duration-400 ease-in-out w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] hover:scale-105 z-10',
                  onClick: () => {
                    const textarea = document.getElementById('starterPrompt');
                    if (textarea) {
                      textarea.value = 'scan app and do not change anithing';
                      textarea.focus();
                    }
                  }
                }, [
                  React.createElement('svg', {
                    key: 'icon',
                    width: 24,
                    height: 24,
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: '#3b82f6',
                    strokeWidth: 2
                  }, [
                    React.createElement('path', { key: 'p1', d: 'M12 2L2 7l10 5 10-5-10-5z' }),
                    React.createElement('path', { key: 'p2', d: 'M2 17l10 5 10-5' }),
                    React.createElement('path', { key: 'p3', d: 'M2 12l10 5 10-5' })
                  ])
                ]),
                React.createElement('div', {
                  key: 'history',
                  className: 'relative cursor-pointer transition-all duration-400 ease-in-out w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] hover:scale-105 z-10'
                }, [
                  React.createElement('svg', {
                    key: 'icon',
                    width: 24,
                    height: 24,
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: '#10b981',
                    strokeWidth: 2
                  }, [
                    React.createElement('path', { key: 'p1', d: 'M3 3v5h5' }),
                    React.createElement('path', { key: 'p2', d: 'M3.05 13A9 9 0 1 0 6 5.3L3 8' }),
                    React.createElement('path', { key: 'p3', d: 'M12 7v5l4 2' })
                  ])
                ]),
                React.createElement('div', {
                  key: 'time',
                  className: 'relative cursor-pointer transition-all duration-400 ease-in-out w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] hover:scale-105 z-10'
                }, [
                  React.createElement('svg', {
                    key: 'icon',
                    width: 24,
                    height: 24,
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: '#f59e0b',
                    strokeWidth: 2
                  }, [
                    React.createElement('circle', { key: 'c', cx: 12, cy: 12, r: 10 }),
                    React.createElement('polyline', { key: 'p', points: '12,6 12,12 16,14' })
                  ])
                ])
              ])
            ]);
            
            // Render the component
            ReactDOM.render(LooperComponent, rootContainer);
            
            return { success: true, injected: true };
          }).catch(error => {
            console.error('Failed to load dependencies:', error);
            return { success: false, error: error.message };
          });
        }
      }, function(results) {
        if (results && results[0] && results[0].result && results[0].result.success) {
          panelStatusEl.textContent = 'Active';
          togglePanelBtn.textContent = 'Hide Panel';
        }
      });
    });
  }
});