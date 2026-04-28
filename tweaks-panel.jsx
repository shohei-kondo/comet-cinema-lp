/* 編集用パネル — Manga_story.html のインラインスクリプトと共有（window に公開） */
(function () {
  const { useState, useCallback } = React;

  function useTweaks(defaults) {
    const [tweaks, setTweaks] = useState(defaults);
    const setTweakRaw = useCallback((key, value) => {
      setTweaks(function (prev) {
        return { ...prev, [key]: value };
      });
    }, []);
    return [tweaks, setTweakRaw];
  }

  function TweakSection(props) {
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#222', marginBottom: 8 }}>{props.label}</div>
        {props.children}
      </div>
    );
  }

  function TweakRadio(props) {
    return (
      <div>
        <div style={{ fontSize: 10, color: '#555', marginBottom: 8 }}>{props.label}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {props.options.map(function (opt) {
            var active = props.value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => props.onChange(opt)}
                style={{
                  padding: '8px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  border: active ? '2px solid #2AA5DB' : '1px solid #bbb',
                  borderRadius: 8,
                  background: active ? '#EBF7FD' : '#fff',
                  color: '#111',
                  cursor: 'pointer',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function TweakSlider(props) {
    return (
      <div>
        <div style={{ fontSize: 10, color: '#555', marginBottom: 6 }}>
          {props.label}
          <span style={{ fontWeight: 900, marginLeft: 8 }}>{props.value}</span>
        </div>
        <input
          type="range"
          min={props.min}
          max={props.max}
          step={props.step}
          value={props.value}
          onChange={function (e) {
            props.onChange(Number(e.target.value));
          }}
          style={{ width: '100%', maxWidth: 280 }}
        />
      </div>
    );
  }

  function TweaksPanel(props) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(function (o) {
            return !o;
          })}
          style={{
            position: 'fixed',
            bottom: 14,
            right: 14,
            zIndex: 100000,
            padding: '10px 14px',
            fontSize: 12,
            fontWeight: 900,
            fontFamily: "'Noto Sans JP', sans-serif",
            borderRadius: 8,
            border: '2px solid #111',
            background: '#FFE133',
            color: '#111',
            cursor: 'pointer',
            boxShadow: '4px 4px 0 #111',
          }}
        >
          {open ? '調整パネルを閉じる' : '表示を調整'}
        </button>
        {open && (
          <div
            style={{
              position: 'fixed',
              bottom: 58,
              right: 14,
              left: 14,
              maxHeight: '48vh',
              overflowY: 'auto',
              zIndex: 99999,
              padding: 16,
              background: '#fff',
              border: '2px solid #111',
              borderRadius: 10,
              boxShadow: '6px 6px 0 rgba(0,0,0,0.12)',
              maxWidth: 430,
              marginLeft: 'auto',
            }}
          >
            {props.children}
          </div>
        )}
      </>
    );
  }

  Object.assign(window, {
    useTweaks: useTweaks,
    TweaksPanel: TweaksPanel,
    TweakSection: TweakSection,
    TweakRadio: TweakRadio,
    TweakSlider: TweakSlider,
  });
})();
