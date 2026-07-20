:root{
  color-scheme:dark;
  --bg:#111412;
  --bg-elevated:#171b18;
  --surface:#202521;
  --surface-2:#272c28;
  --surface-3:#2d332f;
  --line:rgba(255,255,255,.075);
  --text:#f5f1ec;
  --muted:#9ea49f;
  --muted-2:#747b76;
  --peach:#f5a58f;
  --peach-strong:#ee8c73;
  --sage:#b7d0a0;
  --blue:#9ebed8;
  --gold:#e2c37b;
  --danger:#ff8178;
  --shadow:0 24px 80px rgba(0,0,0,.38);
  --shadow-soft:0 12px 36px rgba(0,0,0,.18);
  --radius-xl:28px;
  --radius-lg:22px;
  --radius-md:17px;
  --radius-sm:13px;
  --safe-top:env(safe-area-inset-top,0px);
  --safe-bottom:env(safe-area-inset-bottom,0px);
}

*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{min-height:100%;background:#0c0f0d;scroll-behavior:smooth}
body{margin:0;min-height:100%;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;background:
  radial-gradient(circle at 8% -8%,rgba(183,208,160,.12),transparent 34%),
  radial-gradient(circle at 95% 6%,rgba(245,165,143,.12),transparent 30%),
  #0d100e;color:var(--text);overflow:hidden}
button,input{font:inherit}button{color:inherit}svg{display:block;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
button{touch-action:manipulation}

.app-shell{width:min(100vw,480px);height:100dvh;margin:0 auto;background:linear-gradient(180deg,#171a18 0%,#111412 100%);position:relative;overflow:hidden;box-shadow:var(--shadow)}
@media(min-width:620px){body{display:grid;place-items:center;padding:24px}.app-shell{height:min(920px,calc(100dvh - 48px));border-radius:40px;border:8px solid #090b0a}}

.topbar{height:calc(72px + var(--safe-top));padding:var(--safe-top) 14px 0;display:grid;grid-template-columns:44px 1fr 44px;align-items:center;position:relative;z-index:30;background:linear-gradient(180deg,rgba(23,27,24,.98),rgba(23,27,24,.88),rgba(23,27,24,0));backdrop-filter:blur(14px)}
.topbar__center{text-align:center;min-width:0}.topbar__eyebrow{font-size:10px;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:3px}.topbar__title{margin:0;font-size:20px;line-height:1.1;letter-spacing:-.025em;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.topbar__edge{justify-self:center}
.icon-button{width:42px;height:42px;border:1px solid transparent;border-radius:14px;background:transparent;display:grid;place-items:center;cursor:pointer}.icon-button svg{width:21px;height:21px}.icon-button:active{background:rgba(255,255,255,.055);border-color:var(--line)}

.viewport{height:calc(100% - 72px - var(--safe-top));position:relative;overflow:hidden}.screen{position:absolute;inset:0;overflow-y:auto;overscroll-behavior:contain;padding:0 14px calc(104px + var(--safe-bottom));opacity:0;pointer-events:none;transform:translateY(8px);transition:opacity .22s ease,transform .22s ease;scrollbar-width:none}.screen::-webkit-scrollbar{display:none}.screen.is-active{opacity:1;pointer-events:auto;transform:none}

.date-switcher{display:grid;grid-template-columns:42px 1fr 42px;gap:7px;align-items:center;padding:4px 0 14px}.date-switcher__arrow{height:42px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.025);display:grid;place-items:center}.date-switcher__arrow svg{width:19px;height:19px}.date-switcher__arrow:active{background:var(--surface)}.date-switcher__label{border:0;background:transparent;text-align:center;padding:4px}.date-switcher__label span{display:block;font-size:14px;font-weight:760}.date-switcher__label small{display:block;color:var(--muted);font-size:11px;margin-top:3px}

.hero-card{background:
  radial-gradient(circle at 87% 13%,rgba(245,165,143,.14),transparent 30%),
  linear-gradient(180deg,var(--surface-2),var(--surface));border:1px solid var(--line);border-radius:var(--radius-xl);padding:18px;box-shadow:var(--shadow-soft)}
.hero-card__top{display:grid;grid-template-columns:1fr auto;align-items:center;gap:16px}.hero-card__label{display:flex;align-items:center;gap:8px;font-size:13px;color:#d9ddd8}.dot{width:8px;height:8px;border-radius:50%;display:inline-block}.dot--peach{background:var(--peach);box-shadow:0 0 0 5px rgba(245,165,143,.09)}.hero-card__value{font-size:34px;line-height:1;font-weight:850;letter-spacing:-.045em;margin-top:11px}.hero-card__value small{font-size:16px;font-weight:520;color:#d6d1cc;letter-spacing:0}.hero-card__caption{font-size:12px;color:var(--muted);margin-top:7px}
.progress-ring{--progress:0;width:92px;height:92px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--peach) calc(var(--progress)*1%),#3b413d 0);position:relative;box-shadow:inset 0 0 0 1px rgba(255,255,255,.03)}.progress-ring:before{content:"";position:absolute;inset:9px;border-radius:50%;background:#242925}.progress-ring__inner{position:relative;text-align:center}.progress-ring__inner strong{display:block;font-size:20px}.progress-ring__inner span{display:block;font-size:9px;color:var(--muted);margin-top:2px;text-transform:uppercase;letter-spacing:.08em}
.macro-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:18px;padding-top:16px;border-top:1px solid var(--line)}.macro-card{min-width:0}.macro-card__head{display:flex;flex-direction:column;gap:4px}.macro-card__head span{font-size:10px;color:var(--muted)}.macro-card__head strong{font-size:11px;white-space:nowrap}.progress-track{height:6px;border-radius:99px;background:#3b403c;overflow:hidden;margin-top:9px}.progress-track i{display:block;width:var(--width);height:100%;border-radius:inherit;background:var(--bar);transition:width .35s ease}

.section-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin:22px 3px 11px}.section-heading h2{margin:0;font-size:17px;letter-spacing:-.02em}.section-heading p{margin:4px 0 0;font-size:11px;color:var(--muted)}.section-heading--compact{margin-top:17px}.text-button{border:0;background:transparent;color:var(--peach);font-size:12px;font-weight:750;padding:8px}
.meal-list{display:grid;gap:10px}.meal-card{background:linear-gradient(180deg,#262b27,#202420);border:1px solid var(--line);border-radius:20px;overflow:hidden;box-shadow:0 9px 24px rgba(0,0,0,.12)}.meal-card__header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px}.meal-card__main{display:flex;align-items:center;gap:12px;min-width:0}.meal-icon{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:#303631;font-size:19px;flex:0 0 auto}.meal-card__copy{min-width:0}.meal-card__copy h3{margin:0;font-size:14px}.meal-card__copy p{margin:4px 0 0;font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:225px}.meal-card__side{display:flex;align-items:center;gap:9px}.meal-card__calories{text-align:right;min-width:48px}.meal-card__calories strong{display:block;font-size:12px}.meal-card__calories small{display:block;color:var(--muted);font-size:9px;margin-top:3px}.add-circle{width:36px;height:36px;border:0;border-radius:50%;background:#343a35;color:var(--peach);font-size:21px;display:grid;place-items:center}.add-circle:active{transform:scale(.95)}.meal-card__entries{display:none;border-top:1px solid var(--line)}.meal-card.is-open .meal-card__entries{display:block}.meal-entry{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-top:1px solid rgba(255,255,255,.04);cursor:pointer}.meal-entry:first-child{border-top:0}.meal-entry h4{margin:0;font-size:12px}.meal-entry p{margin:4px 0 0;color:var(--muted);font-size:10px}.meal-entry__value{text-align:right;white-space:nowrap}.meal-entry__value strong{display:block;font-size:11px}.meal-entry__value small{display:block;color:var(--muted);font-size:9px;margin-top:3px}.meal-empty{padding:15px;text-align:center;color:var(--muted);font-size:11px}

.segmented-control{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;background:#202420;border:1px solid var(--line);border-radius:16px;padding:5px;margin:4px 0 14px}.segment{border:0;background:transparent;border-radius:12px;color:var(--muted);font-size:11px;padding:10px 5px}.segment.is-active{background:var(--peach);color:#2d1915;font-weight:850}.add-view.is-hidden,.is-hidden{display:none!important}
.search-field{height:48px;border:1px solid var(--line);background:#202420;border-radius:16px;display:grid;grid-template-columns:24px 1fr 32px;align-items:center;gap:7px;padding:0 10px 0 14px}.search-field svg{width:19px;height:19px;color:var(--muted)}.search-field input{border:0;outline:0;background:transparent;color:var(--text);width:100%;font-size:13px}.search-field input::placeholder{color:#777e79}.search-field button{width:30px;height:30px;border:0;border-radius:10px;background:transparent;color:var(--muted);font-size:20px}
.recent-strip{display:flex;gap:9px;overflow-x:auto;padding:14px 1px 10px;scrollbar-width:none}.recent-strip::-webkit-scrollbar{display:none}.recent-chip{border:1px solid var(--line);background:#202420;border-radius:15px;padding:9px 11px;display:flex;align-items:center;gap:8px;white-space:nowrap;font-size:11px}.recent-chip span{font-size:17px}.food-list{display:grid;gap:9px}.food-row{display:flex;align-items:center;gap:12px;padding:11px;border:1px solid var(--line);background:linear-gradient(180deg,#252a26,#1f231f);border-radius:18px;cursor:pointer}.food-row:active{transform:scale(.995);background:#292e2a}.food-avatar{width:52px;height:52px;border-radius:17px;display:grid;place-items:center;background:linear-gradient(145deg,#dfb78f,#9a7257);font-size:25px;flex:0 0 auto;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}.food-avatar--custom{background:linear-gradient(145deg,#667b65,#3b4a3d);color:var(--sage);font-size:27px}.food-row__copy{min-width:0;flex:1}.food-row__copy h3{margin:0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.food-row__copy p{margin:5px 0 0;font-size:10px;color:var(--muted);line-height:1.35}.food-row__chevron{width:18px;height:18px;color:var(--muted-2)}

.form-card,.scanner-card{background:linear-gradient(180deg,var(--surface-2),var(--surface));border:1px solid var(--line);border-radius:var(--radius-xl);padding:17px;box-shadow:var(--shadow-soft)}.form-card__title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}.form-card__title h2,.scanner-card h2{margin:0;font-size:18px}.form-card__title p,.scanner-card p{margin:4px 0 0;font-size:11px;color:var(--muted);line-height:1.5}.field{display:block;margin-bottom:12px}.field>span{display:block;font-size:11px;color:#cdd1cc;margin:0 0 7px}.field input{width:100%;height:46px;border:1px solid var(--line);border-radius:14px;background:#171a18;color:var(--text);padding:0 13px;outline:0}.field input:focus{border-color:rgba(245,165,143,.5);box-shadow:0 0 0 4px rgba(245,165,143,.08)}.field-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.primary-button,.secondary-button{min-height:48px;border-radius:16px;font-weight:850;font-size:13px;cursor:pointer}.primary-button{width:100%;border:0;background:linear-gradient(135deg,var(--peach),var(--peach-strong));color:#2d1814;box-shadow:0 12px 28px rgba(238,140,115,.17)}.primary-button:active,.secondary-button:active{transform:translateY(1px)}.secondary-button{border:1px solid var(--line);background:#272c28;color:#e2ded9;padding:0 16px}.button-row{display:grid;grid-template-columns:1fr 1.3fr;gap:9px}.scanner-card__art{height:160px;border-radius:22px;background:
 radial-gradient(circle at 50% 36%,rgba(245,165,143,.13),transparent 36%),
 #171a18;margin-bottom:17px;display:grid;place-items:center;position:relative;overflow:hidden}.barcode-lines{width:170px;height:76px;background:repeating-linear-gradient(90deg,#e8e4df 0 3px,transparent 3px 6px,#e8e4df 6px 8px,transparent 8px 12px);opacity:.86;border-radius:4px}.scan-beam{position:absolute;left:18%;right:18%;height:2px;background:var(--peach);box-shadow:0 0 18px var(--peach);animation:scan 2.4s ease-in-out infinite}@keyframes scan{0%,100%{transform:translateY(-52px)}50%{transform:translateY(52px)}}.scanner-video{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:18px;margin-top:12px;background:#000}

.inline-back{border:0;background:transparent;color:var(--muted);display:inline-flex;align-items:center;gap:6px;font-size:11px;padding:2px 0 11px}.inline-back svg{width:17px;height:17px}.selected-food-card,.portion-card,.nutrition-card{background:linear-gradient(180deg,var(--surface-2),var(--surface));border:1px solid var(--line);border-radius:var(--radius-lg);padding:15px;margin-bottom:10px;box-shadow:0 10px 26px rgba(0,0,0,.12)}.selected-food-card{display:flex;align-items:center;gap:13px}.selected-food-card__copy h2{margin:0;font-size:16px}.selected-food-card__copy p{margin:5px 0 0;color:var(--muted);font-size:11px}.portion-card__head,.nutrition-card__head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.portion-card__head h3,.nutrition-card__head h3{margin:0;font-size:14px}.portion-card__head p{margin:4px 0 0;color:var(--muted);font-size:10px}.portion-card__head>span,.nutrition-card__head>span{font-size:10px;color:var(--muted)}.portion-control{display:grid;grid-template-columns:48px 1fr 48px;align-items:center;gap:12px;margin:17px 0 7px}.portion-control button{height:48px;border:1px solid var(--line);border-radius:15px;background:#343a35;color:var(--peach);font-size:22px}.portion-control div{text-align:center}.portion-control strong{font-size:34px;letter-spacing:-.04em}.portion-control div span{font-size:13px;color:var(--muted);margin-left:4px}.portion-card input[type=range]{width:100%;accent-color:var(--peach)}.nutrition-stats{display:grid;grid-template-columns:repeat(4,1fr);margin-top:15px}.nutrition-stats>div{text-align:center;border-right:1px solid var(--line);min-width:0}.nutrition-stats>div:last-child{border-right:0}.nutrition-stats small{display:block;color:var(--muted);font-size:9px}.nutrition-stats strong{display:block;font-size:17px;margin-top:6px}.nutrition-stats span{display:block;color:var(--muted);font-size:8px;margin-top:2px}.meal-selector{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:11px}.meal-choice{min-height:48px;border:1px solid var(--line);background:#222622;border-radius:14px;color:var(--muted);font-size:10px;padding:6px}.meal-choice span{display:block;font-size:16px;margin-bottom:4px}.meal-choice.is-active{background:rgba(245,165,143,.12);border-color:rgba(245,165,143,.42);color:var(--peach)}.primary-button--sticky{position:sticky;bottom:0}

.period-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;background:#202420;border:1px solid var(--line);border-radius:16px;padding:5px;margin:4px 0 12px}.period-tabs button{border:0;background:transparent;border-radius:12px;color:var(--muted);font-size:11px;padding:10px}.period-tabs button.is-active{background:var(--peach);color:#2e1915;font-weight:850}.chart-card{background:linear-gradient(180deg,var(--surface-2),var(--surface));border:1px solid var(--line);border-radius:var(--radius-xl);padding:17px;box-shadow:var(--shadow-soft)}.chart-card__head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.chart-card__head p{margin:0;color:var(--muted);font-size:10px}.chart-card__head h2{margin:6px 0 0;font-size:27px;letter-spacing:-.035em}.trend-chip{border:1px solid rgba(183,208,160,.18);background:rgba(183,208,160,.09);color:var(--sage);border-radius:999px;padding:7px 10px;font-size:10px}.weight-chart{width:100%;height:175px;margin-top:6px;overflow:visible}.chart-card__axis{display:flex;justify-content:space-between;color:var(--muted-2);font-size:9px;margin:-5px 2px 12px}.chart-card .secondary-button{width:100%}.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.stat-card{background:linear-gradient(180deg,#252a26,#202420);border:1px solid var(--line);border-radius:18px;padding:14px}.stat-card__icon{width:29px;height:29px;border-radius:10px;display:grid;place-items:center;font-size:12px;font-weight:850;margin-bottom:12px}.stat-card__icon--peach{background:rgba(245,165,143,.12);color:var(--peach)}.stat-card__icon--sage{background:rgba(183,208,160,.12);color:var(--sage)}.stat-card__icon--blue{background:rgba(158,190,216,.12);color:var(--blue)}.stat-card small{display:block;color:var(--muted);font-size:9px}.stat-card strong{display:block;font-size:22px;margin-top:6px}.stat-card p{margin:2px 0 0;color:var(--muted);font-size:9px}.streak-card{display:grid;grid-template-columns:48px 1fr auto;align-items:center;gap:12px;background:linear-gradient(180deg,#252a26,#202420);border:1px solid var(--line);border-radius:20px;padding:14px}.streak-card__icon{width:48px;height:48px;border-radius:16px;background:rgba(245,165,143,.12);color:var(--peach);display:grid;place-items:center;font-size:22px}.streak-card h3{margin:0;font-size:14px}.streak-card p{margin:4px 0 0;color:var(--muted);font-size:10px;line-height:1.4}.streak-card>strong{font-size:25px;color:var(--peach)}

.profile-card{display:flex;align-items:center;gap:13px;background:
 radial-gradient(circle at 92% 10%,rgba(245,165,143,.13),transparent 35%),
 linear-gradient(180deg,var(--surface-2),var(--surface));border:1px solid var(--line);border-radius:var(--radius-xl);padding:16px}.profile-card__avatar{width:60px;height:60px;border-radius:20px;background:linear-gradient(145deg,#6f8369,#c69a82);display:grid;place-items:center;font-size:27px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}.profile-card__copy{min-width:0;flex:1}.profile-card__copy h2{margin:0;font-size:17px}.profile-card__copy p{margin:5px 0 0;color:var(--muted);font-size:11px}.goal-list,.settings-list{display:grid;gap:9px}.goal-row,.settings-row{display:flex;align-items:center;gap:12px;background:#202420;border:1px solid var(--line);border-radius:17px;padding:12px 13px}.goal-row__icon,.settings-row__icon{width:37px;height:37px;border-radius:13px;display:grid;place-items:center;font-weight:850;flex:0 0 auto}.goal-row__icon--peach{background:rgba(245,165,143,.12);color:var(--peach)}.goal-row__icon--sage{background:rgba(183,208,160,.12);color:var(--sage)}.goal-row__icon--blue{background:rgba(158,190,216,.12);color:var(--blue)}.goal-row div small{display:block;color:var(--muted);font-size:9px}.goal-row div strong{display:block;font-size:13px;margin-top:4px}.settings-row{width:100%;text-align:left;color:var(--text);cursor:pointer}.settings-row__icon{background:#303531;color:#d9ddd8}.settings-row div{flex:1}.settings-row strong{display:block;font-size:12px}.settings-row small{display:block;color:var(--muted);font-size:9px;margin-top:4px}.settings-row>svg{width:18px;height:18px;color:var(--muted-2)}.settings-row--danger{color:var(--danger)}.app-footer{text-align:center;padding:24px 10px 10px}.app-footer p{margin:0;color:var(--muted);font-size:10px;line-height:1.5}.app-footer button{border:0;background:transparent;color:var(--peach);font-size:10px;margin-top:8px}

.bottom-nav{position:absolute;left:10px;right:10px;bottom:calc(10px + var(--safe-bottom));height:70px;z-index:50;display:grid;grid-template-columns:repeat(4,1fr);padding:6px;border:1px solid rgba(255,255,255,.08);border-radius:24px;background:rgba(31,36,32,.9);backdrop-filter:blur(18px);box-shadow:0 18px 50px rgba(0,0,0,.38)}.nav-item{border:0;background:transparent;color:#8f9690;border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;font-size:9px;cursor:pointer}.nav-item svg{width:20px;height:20px}.nav-item.is-active{color:var(--peach);background:rgba(245,165,143,.075)}

.toast{position:absolute;left:50%;top:calc(16px + var(--safe-top));z-index:200;max-width:calc(100% - 40px);padding:11px 14px;border-radius:14px;background:#f4ece4;color:#262925;font-size:11px;font-weight:800;box-shadow:0 18px 45px rgba(0,0,0,.35);transform:translate(-50%,-160%);opacity:0;transition:.28s ease;text-align:center}.toast.is-visible{transform:translate(-50%,0);opacity:1}
.modal-root{position:absolute;inset:0;z-index:100;pointer-events:none}.modal-root.is-open{pointer-events:auto}.modal-backdrop{position:absolute;inset:0;background:rgba(7,9,8,.72);backdrop-filter:blur(9px);display:flex;align-items:flex-end;opacity:0;transition:opacity .22s ease}.modal-root.is-open .modal-backdrop{opacity:1}.sheet{width:100%;max-height:94%;overflow-y:auto;background:linear-gradient(180deg,#222723,#171b18);border:1px solid var(--line);border-radius:30px 30px 0 0;padding:18px 16px calc(18px + var(--safe-bottom));box-shadow:0 -30px 70px rgba(0,0,0,.5);transform:translateY(24px);transition:transform .24s ease;scrollbar-width:none}.modal-root.is-open .sheet{transform:none}.sheet::-webkit-scrollbar{display:none}.sheet__handle{width:42px;height:4px;border-radius:99px;background:#525852;margin:0 auto 17px}.sheet__header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.sheet__header h2{margin:0;font-size:25px;line-height:1.05;letter-spacing:-.035em}.sheet__header h2 em{font-style:normal;color:var(--peach)}.sheet__header p{margin:8px 0 0;color:#bdc2bd;font-size:11px;line-height:1.55}.sheet__close{width:40px;height:40px;border:0;border-radius:14px;background:#303531;font-size:20px;flex:0 0 auto}.sheet__body{margin-top:15px}.sheet__actions{display:grid;grid-template-columns:1fr 1.35fr;gap:9px;margin-top:14px}.sheet__actions--single{grid-template-columns:1fr}.welcome-art{height:202px;border-radius:24px;margin:0 0 17px;background:#e9d9ca;overflow:hidden;position:relative;box-shadow:0 18px 42px rgba(0,0,0,.28);isolation:isolate}.welcome-art>img{width:100%;height:100%;display:block;object-fit:cover;object-position:center}.welcome-art__scrim{position:absolute;inset:38% 0 0;background:linear-gradient(180deg,transparent,rgba(22,26,23,.58));pointer-events:none}.welcome-art__badge{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);max-width:calc(100% - 28px);display:flex;align-items:center;justify-content:center;gap:7px;padding:8px 12px;border:1px solid rgba(255,255,255,.17);border-radius:999px;background:rgba(75,91,68,.86);color:#f1eadf;font-size:9px;line-height:1.2;white-space:nowrap;box-shadow:0 8px 22px rgba(0,0,0,.26);backdrop-filter:blur(8px)}.welcome-art__badge svg{width:17px;height:17px;fill:none;stroke:#d7e5c7;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}.welcome-copy{text-align:center;padding:0 7px 17px}.welcome-copy h2{margin:0;font-family:Georgia,"Times New Roman",serif;font-size:29px;line-height:1.03;font-weight:500;letter-spacing:-.025em;color:#f0e8de}.welcome-copy h2 em{font-style:normal;color:var(--peach)}.welcome-copy h2 span{font-family:system-ui,sans-serif;font-size:.72em}.welcome-copy p{max-width:340px;margin:11px auto 0;color:#b8bdb8;font-size:11px;line-height:1.55}.welcome-install-card{background:linear-gradient(180deg,#242925,#1d211e)}.welcome-privacy{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:13px;color:#8fa17d;font-size:9px}.welcome-privacy svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.install-tabs{display:grid;grid-template-columns:1fr 1fr;gap:7px;background:#171a18;border-radius:15px;padding:5px;margin-bottom:10px}.install-tabs button{border:0;background:transparent;color:var(--muted);border-radius:11px;padding:10px}.install-tabs button.is-active{background:rgba(245,165,143,.12);color:var(--peach)}.step-list{display:grid;gap:8px}.step-row{display:flex;gap:10px;align-items:flex-start;background:#151816;border:1px solid rgba(255,255,255,.04);border-radius:15px;padding:11px}.step-row i{font-style:normal;width:29px;height:29px;border-radius:10px;background:#303531;color:var(--sage);display:grid;place-items:center;font-weight:850;flex:0 0 auto}.step-row p{margin:1px 0 0;color:#d7dbd6;font-size:11px;line-height:1.45}.preview-goals{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:13px 0}.preview-goal{background:#151816;border:1px solid rgba(255,255,255,.04);border-radius:15px;padding:12px}.preview-goal small{display:block;color:var(--muted);font-size:9px}.preview-goal strong{display:block;font-size:19px;margin-top:6px}.edit-entry-summary{background:#151816;border-radius:16px;padding:13px;margin-bottom:12px}.edit-entry-summary h3{margin:0;font-size:14px}.edit-entry-summary p{margin:5px 0 0;color:var(--muted);font-size:10px}.danger-button{min-height:48px;border:1px solid rgba(255,129,120,.25);background:rgba(255,129,120,.09);color:var(--danger);border-radius:16px;font-weight:800}.credits{font-size:11px;line-height:1.65;color:#c7cbc6}.credits a{color:var(--peach)}

@media(max-height:760px){.welcome-art{height:170px}.welcome-copy{padding-bottom:13px}.welcome-copy h2{font-size:26px}.welcome-copy p{font-size:10px}.step-row{padding:9px}.sheet{max-height:96%}}
@media(max-width:370px){.macro-grid{gap:7px}.hero-card{padding:15px}.hero-card__value{font-size:30px}.progress-ring{width:82px;height:82px}.meal-card__copy p{max-width:175px}.nutrition-stats strong{font-size:15px}.meal-selector{grid-template-columns:1fr 1fr}.field-grid{grid-template-columns:1fr}.sheet__actions{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
.meal-card__main{border:0;background:transparent;color:inherit;text-align:left;padding:0;display:flex;align-items:center;gap:12px;min-width:0;flex:1;cursor:pointer}
.meal-entry{width:100%;border:0;background:transparent;color:inherit;text-align:left;font:inherit}.meal-entry:active{background:rgba(255,255,255,.035)}

/* Water + autonomous reminder additions */
.water-card{display:grid;grid-template-columns:52px 1fr;gap:13px;align-items:start;margin-top:12px;padding:15px;background:linear-gradient(145deg,rgba(68,127,157,.24),rgba(31,43,43,.96));border:1px solid rgba(117,191,232,.18);border-radius:var(--radius-xl);box-shadow:var(--shadow-soft)}
.water-card__icon{width:52px;height:52px;border-radius:18px;display:grid;place-items:center;background:rgba(117,191,232,.13);font-size:25px;box-shadow:inset 0 0 0 1px rgba(117,191,232,.12)}
.water-card__content{min-width:0}.water-card__head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.water-card__head h2{margin:0;font-size:15px}.water-card__head p{margin:4px 0 0;color:#a9c3d1;font-size:10px}.water-card__head>strong{font-size:17px;color:#9cd7f3}.progress-track--water{margin-top:10px;background:rgba(117,191,232,.12)}
.water-card__actions{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:6px;margin-top:11px}.water-card__actions button{min-height:36px;border:1px solid rgba(117,191,232,.14);border-radius:12px;background:rgba(10,20,23,.26);color:#d7e9f2;font-size:9px;font-weight:750}.water-card__actions button:active{transform:scale(.98)}.water-card__actions .water-card__undo{width:36px;font-size:17px;color:#91adbb}
.stat-card--wide{grid-column:span 2}.stat-card__icon--water,.goal-row__icon--water{background:rgba(117,191,232,.12);color:#83c9ec}.settings-row--telegram .settings-row__icon{background:rgba(72,164,220,.14);color:#75c7f2}
.salutation-selector{display:grid;grid-template-columns:1fr 1fr;gap:7px;background:#151816;border:1px solid rgba(255,255,255,.04);padding:5px;border-radius:15px}.salutation-selector button{border:0;background:transparent;color:var(--muted);border-radius:11px;padding:11px;font-weight:750}.salutation-selector button.is-active{background:rgba(245,165,143,.12);color:var(--peach);box-shadow:inset 0 0 0 1px rgba(245,165,143,.2)}
.telegram-status-card{display:flex;align-items:center;gap:12px;background:#151816;border:1px solid rgba(255,255,255,.05);border-radius:17px;padding:13px;margin-bottom:12px}.telegram-status-card__dot{width:11px;height:11px;border-radius:50%;background:#717873;box-shadow:0 0 0 5px rgba(113,120,115,.1);flex:0 0 auto}.telegram-status-card.is-connected .telegram-status-card__dot{background:#8bcf87;box-shadow:0 0 0 5px rgba(139,207,135,.1)}.telegram-status-card strong{display:block;font-size:12px}.telegram-status-card small{display:block;color:var(--muted);font-size:9px;margin-top:4px}
.telegram-code{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;background:#151816;border:1px dashed rgba(117,199,242,.3);border-radius:16px;padding:12px;margin:12px 0}.telegram-code strong{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:24px;letter-spacing:.12em;color:#8dd4f6}.telegram-code button{border:0;border-radius:11px;background:#2c3537;color:#dceef6;padding:9px 11px;font-size:10px}
.field textarea{width:100%;min-height:74px;resize:vertical;border:1px solid var(--line);background:#151816;color:var(--text);border-radius:15px;padding:12px 13px;outline:none;line-height:1.45}.field textarea:focus{border-color:rgba(245,165,143,.42);box-shadow:0 0 0 4px rgba(245,165,143,.07)}
.reminder-time-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.reminder-section{margin-top:14px;padding-top:14px;border-top:1px solid var(--line)}.reminder-section h3{margin:0 0 9px;font-size:13px}.reminder-note{font-size:9px;color:var(--muted);line-height:1.55;margin:9px 0 0}.switch-row{display:flex;align-items:center;justify-content:space-between;gap:12px;background:#151816;border-radius:14px;padding:11px 12px}.switch-row span{font-size:11px}.switch{position:relative;width:44px;height:25px;flex:0 0 auto}.switch input{position:absolute;opacity:0}.switch i{position:absolute;inset:0;border-radius:99px;background:#363b37;transition:.2s}.switch i::after{content:"";position:absolute;width:19px;height:19px;left:3px;top:3px;border-radius:50%;background:#f3eee8;transition:.2s}.switch input:checked+i{background:#70b8de}.switch input:checked+i::after{transform:translateX(19px)}
.mental-card{padding:15px;background:linear-gradient(145deg,rgba(183,208,160,.12),rgba(34,40,35,.96));border:1px solid rgba(183,208,160,.15);border-radius:18px}.mental-card h3{margin:0;font-size:14px}.mental-card p{margin:7px 0 0;color:#bcc8b5;font-size:10px;line-height:1.55}.mental-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:12px}.mental-actions button{border:1px solid rgba(183,208,160,.16);background:rgba(15,22,17,.25);color:#d8e2d2;border-radius:12px;padding:10px 4px;font-size:10px}
@media(max-width:370px){.water-card{grid-template-columns:44px 1fr}.water-card__icon{width:44px;height:44px}.water-card__actions{grid-template-columns:1fr 1fr}.water-card__actions .water-card__undo{width:auto}.reminder-time-grid{grid-template-columns:1fr}}

.scanner-photo-button{width:100%;min-height:44px;margin-top:9px;border:1px dashed rgba(181,207,161,.35);border-radius:15px;background:rgba(181,207,161,.07);color:var(--sage);font-size:12px;font-weight:800;cursor:pointer}.scanner-photo-button:active{transform:translateY(1px)}.scanner-status{min-height:18px;margin:10px 2px 0!important;color:var(--muted)!important;font-size:11px!important}.scanner-status.is-error{color:#ff9f96!important}.scanner-status.is-success{color:var(--sage)!important}.scanner-video{border:1px solid rgba(255,255,255,.08);box-shadow:0 12px 34px rgba(0,0,0,.28)}

.session-sync-gate {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(13, 16, 14, .92);
  backdrop-filter: blur(16px);
  opacity: 0;
  visibility: hidden;
  transition: opacity .2s ease, visibility .2s ease;
}

.session-sync-gate.is-visible {
  opacity: 1;
  visibility: visible;
}

.session-sync-gate__card {
  width: min(320px, 100%);
  padding: 24px;
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 24px;
  background: #1b201c;
  box-shadow: 0 24px 80px rgba(0,0,0,.38);
  text-align: center;
}

.session-sync-gate__card i {
  display: block;
  width: 44px;
  height: 44px;
  margin: 0 auto 16px;
  border: 4px solid rgba(183,208,160,.22);
  border-top-color: #b7d0a0;
  border-radius: 50%;
  animation: sw-session-spin .8s linear infinite;
}

.session-sync-gate__card strong,
.session-sync-gate__card small {
  display: block;
}

.session-sync-gate__card strong {
  color: #f3eee8;
  font-size: 16px;
  line-height: 1.4;
}

.session-sync-gate__card small {
  margin-top: 8px;
  color: #8f9991;
  font-size: 12px;
}

@keyframes sw-session-spin {
  to { transform: rotate(360deg); }
}

.telegram-status-card.is-pending{border-color:rgba(117,199,242,.2);background:linear-gradient(145deg,rgba(117,199,242,.08),#151816)}
.telegram-status-card.is-pending .telegram-status-card__dot{background:#75c7f2;box-shadow:0 0 0 5px rgba(117,199,242,.11);animation:sw-status-pulse 1.35s ease-in-out infinite}
@keyframes sw-status-pulse{0%,100%{transform:scale(.88);opacity:.65}50%{transform:scale(1.15);opacity:1}}

.auth-success{text-align:center;padding:6px 2px 4px}
.auth-success__icon{width:76px;height:76px;margin:0 auto 16px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,rgba(139,207,135,.24),rgba(117,199,242,.09));border:1px solid rgba(139,207,135,.34);box-shadow:0 18px 42px rgba(0,0,0,.28),0 0 0 9px rgba(139,207,135,.05)}
.auth-success__icon svg{width:38px;height:38px;fill:none;stroke:#a8dda5;stroke-width:2.7;stroke-linecap:round;stroke-linejoin:round}
.auth-success__eyebrow{margin:0 0 7px!important;color:#82c4e6!important;font-size:9px!important;font-weight:900;letter-spacing:.17em}
.auth-success h2{margin:0;font-size:28px;line-height:1.05;letter-spacing:-.04em}.auth-success h2 em{font-style:normal;color:var(--sage)}
.auth-success>p:not(.auth-success__eyebrow){max-width:330px;margin:11px auto 0;color:#bcc4bd;font-size:11px;line-height:1.6}
.auth-success__session{display:inline-flex;align-items:center;gap:10px;margin:16px auto 0;padding:10px 13px;border-radius:14px;background:#141715;border:1px solid rgba(255,255,255,.06)}
.auth-success__session small{color:var(--muted);font-size:9px}.auth-success__session strong{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#8dd4f6;font-size:13px;letter-spacing:.11em}
.auth-success__list{display:grid;gap:8px;margin:17px 0 0;padding:0;list-style:none;text-align:left}
.auth-success__list li{display:flex;align-items:center;gap:9px;padding:10px 11px;border-radius:13px;background:#151816;color:#d9ded9;font-size:10px}
.auth-success__list li span{width:21px;height:21px;border-radius:50%;display:grid;place-items:center;background:rgba(139,207,135,.12);color:#9ed99b;font-weight:900;flex:0 0 auto}


/* Telegram-first account linking */
.telegram-first-flow{display:grid;gap:10px;margin:4px 0 18px}.telegram-first-flow>div{display:flex;gap:12px;align-items:center;padding:12px 13px;border:1px solid rgba(255,255,255,.08);border-radius:18px;background:rgba(255,255,255,.035)}.telegram-first-flow i{display:grid;place-items:center;flex:0 0 32px;height:32px;border-radius:50%;background:rgba(239,166,137,.16);color:var(--peach);font-style:normal;font-weight:800}.telegram-first-flow p{display:grid;gap:2px;margin:0}.telegram-first-flow strong{font-size:14px}.telegram-first-flow small{color:var(--muted);line-height:1.35}.sync-choice{width:100%;display:grid;gap:5px;text-align:left;padding:16px;margin-bottom:10px;border:1px solid rgba(255,255,255,.09);border-radius:19px;background:rgba(255,255,255,.04);color:var(--text);font:inherit}.sync-choice strong{font-size:15px}.sync-choice small{color:var(--muted);line-height:1.45}.sync-choice:active{transform:scale(.99)}

/* Multi-PWA session devices */
.telegram-devices-section{padding:14px}
.telegram-devices-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px}
.telegram-devices-heading h3{margin:0 0 3px}
.telegram-devices-heading p{margin:0;color:var(--muted);font-size:12px;line-height:1.45}
.telegram-devices-heading b{display:grid;place-items:center;min-width:34px;height:34px;padding:0 10px;border-radius:999px;background:rgba(155,190,165,.14);color:var(--sage);font-size:14px}
.telegram-device-list{display:grid;gap:8px}
.telegram-device-row{display:grid;grid-template-columns:32px 1fr auto;align-items:center;gap:10px;padding:11px;border:1px solid rgba(255,255,255,.07);border-radius:14px;background:rgba(255,255,255,.025)}
.telegram-device-row>span{display:grid;place-items:center;width:32px;height:32px;border-radius:11px;background:rgba(236,174,145,.12)}
.telegram-device-row strong{display:block;font-size:13px;color:var(--text)}
.telegram-device-row small{display:block;margin-top:3px;color:var(--muted);font-size:11px}
.telegram-device-row>i{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:rgba(155,190,165,.14);color:var(--sage);font-style:normal;font-size:12px}
.telegram-device-empty{padding:13px;border:1px dashed rgba(255,255,255,.1);border-radius:14px;color:var(--muted);font-size:12px;text-align:center}
