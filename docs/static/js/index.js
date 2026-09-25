window.addEventListener('DOMContentLoaded', function () {
  var cfg = window.PAPER_CONTENT || {};

  function setHtml(id, value) { var el=document.getElementById(id); if(el && value!==undefined) el.innerHTML=value; }
  function setHref(id, value) { var el=document.getElementById(id); if(el && value) el.href=value; }

  setHtml('paper-title',cfg.titleHtml); setHtml('paper-authors',cfg.authorsHtml); setHtml('paper-affiliation',cfg.affiliationHtml);
  setHtml('paper-affiliation-note',cfg.affiliationNoteHtml); setHtml('paper-venue',cfg.venueHtml); setHtml('paper-award',cfg.awardHtml);
  setHtml('teaser-caption',cfg.teaserCaption); setHtml('abstract-copy',cfg.abstractHtml); setHtml('interactive-intro',cfg.interactiveIntroHtml);
  setHtml('interactive-note',cfg.interactiveNoteHtml); setHtml('dataset-title',cfg.datasetTitleHtml); setHtml('dataset-intro-1',cfg.datasetIntro1Html);
  setHtml('dataset-intro-2',cfg.datasetIntro2Html); setHtml('experiments-intro',cfg.experimentsIntroHtml);
  var links=cfg.links||{}; ['pdf','arxiv','explainer','talk','tldr','code','data1','data2','checkpoints'].forEach(function(k){setHref('link-'+k,links[k]);});

  var localWalk=document.getElementById('walkthrough-local'), ytWalk=document.getElementById('walkthrough-youtube');
  if(cfg.walkthroughMode==='youtube' && ytWalk){ if(localWalk)localWalk.classList.add('is-hidden'); ytWalk.classList.remove('is-hidden'); ytWalk.src=cfg.walkthroughYoutubeEmbed||''; }

  var VISER_PLACEHOLDER_TEXT='Choose a scene above';
  var VISER_READY_TEXT='Click and move me';

  function getViewerBanner(viewer){return viewer&&viewer.parentElement?viewer.parentElement.querySelector('.viser-banner'):null}
  function getViewerHint(viewer){if(!viewer)return null;var container=viewer.closest('.interactive-card--viewer,.dataset-block--viewer');return container?container.querySelector('[data-viser-hint]'):null}
  function setViewerHintVisible(viewer,visible){var hint=getViewerHint(viewer);if(hint)hint.classList.toggle('is-hidden',!visible)}
  function setViewerPlaybackDock(viewer,enabled){if(viewer&&viewer.parentElement)viewer.parentElement.classList.toggle('pw-viser-with-playback',!!enabled)}
  function setViewerBanner(banner,isPlaceholder){
    if(!banner)return;
    if(isPlaceholder){banner.textContent=VISER_PLACEHOLDER_TEXT;banner.classList.add('is-placeholder');banner.classList.remove('is-hidden')}
    else{banner.textContent=VISER_READY_TEXT;banner.classList.remove('is-placeholder');banner.classList.add('is-hidden')}
  }

  document.querySelectorAll('video').forEach(function(video){
    video.addEventListener('loadedmetadata',function(){
      if(video.classList.contains('setting-video')||video.classList.contains('method-detail-video')||video.classList.contains('failure-video'))return;
      if(video.classList.contains('experiment-video'))video.playbackRate=2.0;
      var p=video.play();if(p&&p.catch)p.catch(function(){});
    });
  });
  document.querySelectorAll('video.experiment-video').forEach(function(video){
    if(video.parentElement&&video.parentElement.classList.contains('experiment-video-wrapper'))return;
    var parent=video.parentNode;if(!parent)return;
    var wrapper=document.createElement('div');wrapper.className='experiment-video-wrapper';parent.insertBefore(wrapper,video);wrapper.appendChild(video);
    var badge=document.createElement('div');badge.className='video-speed-badge';badge.textContent='2x';wrapper.appendChild(badge);
  });

  (function initEvaluationVideos(){
    var taskSelect=document.getElementById('evaluation-task-select'),rolloutSelect=document.getElementById('evaluation-rollout-select');
    var shuffle=document.getElementById('evaluation-shuffle'),video=document.getElementById('evaluation-video');
    var embodiment=document.getElementById('evaluation-embodiment'),taskTitle=document.getElementById('evaluation-task-title'),rolloutLabel=document.getElementById('evaluation-rollout-label');
    if(!taskSelect||!rolloutSelect||!shuffle||!video)return;
    var base='media/videos/eval_videos/';
    var groups=[
      {key:'franka-cube-stacking',embodiment:'Franka',task:'Cube Stacking',files:['FrankaCubeStacking_EVAL_1~1.mp4','FrankaCubeStacking_EVAL_2~1.mp4','FrankaCubeStacking_EVAL_3~1.mp4','FrankaCubeStacking_EVAL_4~1.mp4','FrankaCubeStacking_EVAL_5~1.mp4']},
      {key:'franka-mug-rack',embodiment:'Franka',task:'Mug Rack',files:['FrankaMugRack_EVAL_1~2.mp4','FrankaMugRack_EVAL_2~2.mp4','FrankaMugRack_EVAL_3~2.mp4','FrankaMugRack_EVAL_4~2.mp4','FrankaMugRack_EVAL_5~2.mp4']},
      {key:'franka-towel-fold',embodiment:'Franka',task:'Towel Folding',files:['FrankaTowelFold_EVAL_1~2.mp4','FrankaTowelFold_EVAL_2~2.mp4','FrankaTowelFold_EVAL_3~2.mp4','FrankaTowelFold_EVAL_4~2.mp4','FrankaTowelFold_EVAL_5~2.mp4']},
      {key:'franka-trash-sweep',embodiment:'Franka',task:'Trash Sweeping',files:['FrankaTrashSweep_EVAL_1~2.mp4','FrankaTrashSweep_EVAL_2~2.mp4','FrankaTrashSweep_EVAL_3~2.mp4','FrankaTrashSweep_EVAL_4~2.mp4','FrankaTrashSweep_EVAL_5~2.mp4']},
      {key:'piper-cube-stacking',embodiment:'Piper',task:'Cube Stacking',files:['PiperCubeStacking_EVAL_1~2.mp4','PiperCubeStacking_EVAL_2~2.mp4','PiperCubeStacking_EVAL_3~2.mp4','PiperCubeStacking_EVAL_4~2.mp4','Piper_CubeStacking~2.mp4']},
      {key:'piper-mug-rack',embodiment:'Piper',task:'Mug Rack',files:['PiperMugRack_EVAL_1~2.mp4','PiperMugRack_EVAL_2~2.mp4','PiperMugRack_EVAL_3~2.mp4','PiperMugRack_EVAL_4~2.mp4','PiperMugRack~2.mp4']}
    ];
    function groupIndex(){var idx=groups.findIndex(function(group){return group.key===taskSelect.value});return idx<0?0:idx}
    function fillRollouts(selected){
      var group=groups[groupIndex()];rolloutSelect.innerHTML='';
      group.files.forEach(function(_,idx){var option=document.createElement('option');option.value=String(idx);option.textContent='Rollout #'+(idx+1);rolloutSelect.appendChild(option)});
      rolloutSelect.value=String(Math.max(0,Math.min(selected||0,group.files.length-1)));
    }
    function activate(shouldPlay){
      var group=groups[groupIndex()],idx=Math.max(0,Math.min(Number(rolloutSelect.value)||0,group.files.length-1));
      var source=video.querySelector('source'),src=base+group.files[idx];video.pause();
      if(source)source.src=src;else video.src=src;video.load();
      if(embodiment)embodiment.textContent=group.embodiment;if(taskTitle)taskTitle.textContent=group.task;if(rolloutLabel)rolloutLabel.textContent='Rollout '+(idx+1)+' of '+group.files.length;
      if(shouldPlay){var play=function(){var promise=video.play();if(promise&&promise.catch)promise.catch(function(){})};if(video.readyState>=2)play();else video.addEventListener('canplay',play,{once:true})}
    }
    taskSelect.addEventListener('change',function(){fillRollouts(0);activate(true)});
    rolloutSelect.addEventListener('change',function(){activate(true)});
    shuffle.addEventListener('click',function(){
      var currentGroup=groupIndex(),currentRollout=Number(rolloutSelect.value)||0,total=groups.reduce(function(sum,group){return sum+group.files.length},0),pick=Math.floor(Math.random()*total),cursor=0,nextGroup=0,nextRollout=0;
      if(total>1&&pick===currentGroup*groups[currentGroup].files.length+currentRollout)pick=(pick+1)%total;
      for(var i=0;i<groups.length;i++){if(pick<cursor+groups[i].files.length){nextGroup=i;nextRollout=pick-cursor;break}cursor+=groups[i].files.length}
      taskSelect.value=groups[nextGroup].key;fillRollouts(nextRollout);activate(true);
    });
    fillRollouts(0);activate(false);
  })();

  function initSettingVideoSelector(container){
    if(!container)return;
    var video=container.querySelector('.setting-video');
    var thumbs=Array.from(container.querySelectorAll('.setting-thumb'));
    var title=container.querySelector('[data-setting-title]');
    var description=container.querySelector('[data-setting-description]');
    var pagination=container.querySelector('.setting-pagination');
    var active=0,dots=[];
    if(!video||!thumbs.length)return;

    if(pagination){
      dots=thumbs.map(function(_,idx){
        var dot=document.createElement('button');
        dot.type='button';dot.className='carousel-dot';dot.setAttribute('aria-label','Show task video '+(idx+1));
        dot.addEventListener('click',function(){activate(idx,true)});
        pagination.appendChild(dot);return dot;
      });
    }

    function activate(idx,play){
      if(idx<0||idx>=thumbs.length)return;
      active=idx;
      var thumb=thumbs[idx],src=thumb.dataset.video||'',poster=thumb.dataset.poster||'';
      video.pause();
      if(video.getAttribute('src')!==src){video.src=src;if(poster)video.poster=poster;video.load()}
      if(title)title.textContent=thumb.dataset.title||'';
      if(description)description.textContent=thumb.dataset.description||'';
      thumbs.forEach(function(item,i){var selected=i===idx;item.classList.toggle('is-active',selected);item.setAttribute('aria-selected',selected?'true':'false')});
      dots.forEach(function(dot,i){dot.classList.toggle('is-active',i===idx)});
      if(play){
        thumb.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
        var startPlayback=function(){var promise=video.play();if(promise&&promise.catch)promise.catch(function(){})};
        if(video.readyState>=2)startPlayback();
        else video.addEventListener('canplay',startPlayback,{once:true});
      }
    }

    thumbs.forEach(function(thumb,idx){thumb.addEventListener('click',function(){activate(idx,true)})});
    container.querySelectorAll('.setting-arrow').forEach(function(arrow){
      arrow.addEventListener('click',function(){var step=arrow.dataset.direction==='prev'?-1:1;activate((active+step+thumbs.length)%thumbs.length,true)});
    });
    activate(0,false);
  }
  document.querySelectorAll('.setting-video-selector').forEach(initSettingVideoSelector);

  (function initMethodTabs(){
    var section=document.getElementById('method');if(!section)return;
    var tabs=Array.from(section.querySelectorAll('[data-method-tab]'));
    var panels=Array.from(section.querySelectorAll('.method-detail-panel'));
    if(!tabs.length||!panels.length)return;
    function activate(index,moveFocus){
      if(index<0||index>=tabs.length)return;
      tabs.forEach(function(tab,i){
        var active=i===index;
        tab.classList.toggle('is-active',active);
        tab.setAttribute('aria-selected',active?'true':'false');
        tab.tabIndex=active?0:-1;
      });
      panels.forEach(function(panel,i){
        var active=i===index;
        panel.hidden=!active;
        panel.classList.toggle('is-active',active);
        var video=panel.querySelector('.method-detail-video');
        if(video){
          if(active){video.currentTime=0;var promise=video.play();if(promise&&promise.catch)promise.catch(function(){})}
          else video.pause();
        }
      });
      if(moveFocus)tabs[index].focus();
    }
    tabs.forEach(function(tab,index){
      tab.addEventListener('click',function(){activate(index,false)});
      tab.addEventListener('keydown',function(event){
        var next=index;
        if(event.key==='ArrowRight')next=(index+1)%tabs.length;
        else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
        else if(event.key==='Home')next=0;
        else if(event.key==='End')next=tabs.length-1;
        else if(event.key==='Enter'||event.key===' '){event.preventDefault();activate(index,false);return}
        else return;
        event.preventDefault();activate(next,true);
      });
    });
    activate(0,false);
  })();

  (function initFailureCarousel(){
    var carousel=document.getElementById('failure-carousel');if(!carousel)return;
    var video=carousel.querySelector('.failure-video');
    var thumbs=Array.from(carousel.querySelectorAll('.failure-thumb'));
    var category=carousel.querySelector('[data-failure-category]');
    var title=carousel.querySelector('[data-failure-title]');
    var summary=carousel.querySelector('[data-failure-summary]');
    var explanation=carousel.querySelector('[data-failure-explanation]');
    var pagination=carousel.querySelector('.failure-pagination');
    var active=0,dots=[];
    if(!video||!thumbs.length)return;
    if(pagination){
      dots=thumbs.map(function(_,index){
        var dot=document.createElement('button');dot.type='button';dot.className='carousel-dot';dot.setAttribute('aria-label','Show failure case '+(index+1));
        dot.addEventListener('click',function(){activate(index,true)});pagination.appendChild(dot);return dot;
      });
    }
    function activate(index,play){
      if(index<0||index>=thumbs.length)return;
      active=index;var thumb=thumbs[index];
      var src=thumb.dataset.video||'',poster=thumb.dataset.poster||'';
      video.pause();
      if(video.getAttribute('src')!==src){video.src=src;if(poster)video.poster=poster;video.load()}
      if(category)category.textContent=thumb.dataset.category||'';
      if(title)title.textContent=thumb.dataset.title||'';
      if(summary)summary.textContent=thumb.dataset.summary||'';
      if(explanation)explanation.textContent=thumb.dataset.explanation||'';
      thumbs.forEach(function(item,i){var selected=i===index;item.classList.toggle('is-active',selected);item.setAttribute('aria-selected',selected?'true':'false');item.tabIndex=selected?0:-1});
      dots.forEach(function(dot,i){dot.classList.toggle('is-active',i===index)});
      thumb.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
      if(play){
        var startPlayback=function(){var promise=video.play();if(promise&&promise.catch)promise.catch(function(){})};
        if(video.readyState>=2)startPlayback();else video.addEventListener('canplay',startPlayback,{once:true});
      }
    }
    thumbs.forEach(function(thumb,index){
      thumb.addEventListener('click',function(){activate(index,true)});
      thumb.addEventListener('keydown',function(event){
        var next=index;if(event.key==='ArrowRight')next=(index+1)%thumbs.length;else if(event.key==='ArrowLeft')next=(index-1+thumbs.length)%thumbs.length;else return;
        event.preventDefault();activate(next,true);thumbs[next].focus();
      });
    });
    carousel.querySelectorAll('.failure-arrow').forEach(function(arrow){
      arrow.addEventListener('click',function(){var step=arrow.dataset.direction==='prev'?-1:1;activate((active+step+thumbs.length)%thumbs.length,true)});
    });
    activate(0,false);
  })();

  var DEFAULT_CAMERA={position:'1.00,0.00,1.00',lookAt:'0.00,0.00,0.00',up:'0.000,0.000,1.000'};
  function cameraFromButton(button,target){
    if(!button)return DEFAULT_CAMERA;var suffix=target?'-'+target:'';
    return {
      position:button.getAttribute('data-camera-position'+suffix)||button.getAttribute('data-camera-position')||DEFAULT_CAMERA.position,
      lookAt:button.getAttribute('data-camera-lookat'+suffix)||button.getAttribute('data-camera-lookat')||DEFAULT_CAMERA.lookAt,
      up:button.getAttribute('data-camera-up'+suffix)||button.getAttribute('data-camera-up')||DEFAULT_CAMERA.up
    };
  }
  function buildViewerSrc(base,filename,camera,dockPlayback){
    var rawPath='../../'+base+'/'+filename;
    var encoded=encodeURI(rawPath).replace(/\+/g,'%2B');
    return 'static/viser-client/index.html?playbackPath='+encoded+
      '&initialCameraPosition='+encodeURIComponent(camera.position)+
      '&initialCameraLookAt='+encodeURIComponent(camera.lookAt)+
      '&initialCameraUp='+encodeURIComponent(camera.up)+(dockPlayback?'&pwDockPlayback=1':'');
  }
  async function recordingExists(base,filename){
    try{var r=await fetch(base+'/'+filename,{method:'HEAD',cache:'no-store'});return r.ok}catch(e){return false}
  }
  async function loadViewer(viewer,banner,base,filename,camera,dockPlayback){
    if(!viewer)return;
    var ok=await recordingExists(base,filename);
    if(!ok){viewer.removeAttribute('src');viewer.dataset.base='';setViewerBanner(banner,true);setViewerHintVisible(viewer,false);setViewerPlaybackDock(viewer,false);return}
    viewer.src=buildViewerSrc(base,filename,camera,dockPlayback);viewer.dataset.base=base;setViewerBanner(banner,false);setViewerHintVisible(viewer,true);setViewerPlaybackDock(viewer,dockPlayback);
  }

  function createMagnifier(imageMap,roles){
    var zoom=2.5,lensSize=180,lenses={};
    function lens(role){if(!lenses[role]){var el=document.createElement('div');el.className='dataset-magnifier-lens is-hidden';document.body.appendChild(el);lenses[role]=el}return lenses[role]}
    function hideAll(){Object.keys(lenses).forEach(function(k){lenses[k].classList.add('is-hidden')})}
    roles.forEach(function(role){
      var img=imageMap[role];if(!img)return;
      function move(e){
        var r=img.getBoundingClientRect(),x=Math.max(0,Math.min(r.width,e.clientX-r.left)),y=Math.max(0,Math.min(r.height,e.clientY-r.top)),l=lens(role);
        l.style.backgroundImage='url("'+(img.currentSrc||img.src)+'")';l.style.backgroundSize=(r.width*zoom)+'px '+(r.height*zoom)+'px';
        l.style.backgroundPosition=-(x*zoom-lensSize/2)+'px '+-(y*zoom-lensSize/2)+'px';
        var left=e.clientX+12,top=e.clientY-lensSize/2;if(left+lensSize>innerWidth-8)left=e.clientX-lensSize-12;top=Math.max(8,Math.min(innerHeight-lensSize-8,top));
        l.style.left=Math.round(left)+'px';l.style.top=Math.round(top)+'px';l.classList.remove('is-hidden');
      }
      img.addEventListener('mouseenter',move);img.addEventListener('mousemove',move);img.addEventListener('mouseleave',function(){lens(role).classList.add('is-hidden')});
      window.addEventListener('scroll',function(){lens(role).classList.add('is-hidden')},{passive:true});window.addEventListener('resize',function(){lens(role).classList.add('is-hidden')});
    });
    return {hideAll:hideAll};
  }

  // Shared PointWorld-style prediction/GT viewers.
  var predFrame=document.getElementById('interactive-pred'),gtFrame=document.getElementById('interactive-gt');
  var predBanner=getViewerBanner(predFrame),gtBanner=getViewerBanner(gtFrame);
  if(predFrame){predFrame.removeAttribute('src');predFrame.dataset.base=''} if(gtFrame){gtFrame.removeAttribute('src');gtFrame.dataset.base=''}
  setViewerBanner(predBanner,true);setViewerBanner(gtBanner,true);setViewerHintVisible(predFrame,false);setViewerHintVisible(gtFrame,false);

  function initOneCarousel(opts){
    var container=opts.container;if(!container)return null;
    var row=container.querySelector(opts.thumbRowSelector),thumbs=Array.from(container.querySelectorAll(opts.thumbRowSelector+' .interactive-thumb'));
    var dotsBox=container.querySelector(opts.dotsSelector),inputs=document.getElementById(opts.inputsCardId),imageMap={};
    opts.imageRoles.forEach(function(role){imageMap[role]=inputs?inputs.querySelector('[data-role="'+role+'"]'):null});
    var mag=createMagnifier(imageMap,opts.imageRoles),active=-1,dots=[];
    if(dotsBox){dotsBox.innerHTML='';dots=thumbs.map(function(_,idx){var d=document.createElement('button');d.type='button';d.className='carousel-dot';d.setAttribute('aria-label','Show interactive scene '+(idx+1));d.addEventListener('click',function(){activate(idx)});dotsBox.appendChild(d);return d})}
    function updateImages(base,label){
      function set(role,path,alt){if(imageMap[role]){imageMap[role].src=base+'/'+path;imageMap[role].alt=(label||'')+' '+alt}}
      set('rgb0','cameras-rgb/cam0.png','RGB cam0');set('depth0','cameras-depth/cam0.png','depth cam0');set('rgb1','cameras-rgb/cam1.png','RGB cam1');set('depth1','cameras-depth/cam1.png','depth cam1');
      if(imageMap.rgb2)set('rgb2','cameras-rgb/cam2.png','RGB cam2');if(imageMap.depth2)set('depth2','cameras-depth/cam2.png','depth cam2');
    }
    async function activate(idx){
      if(idx<0||idx>=thumbs.length)return;active=idx;thumbs.forEach(function(b,i){b.classList.toggle('is-active',i===idx);b.setAttribute('aria-pressed',i===idx?'true':'false')});dots.forEach(function(d,i){d.classList.toggle('is-active',i===idx)});
      var button=thumbs[idx],base=button.getAttribute('data-base'),label=button.getAttribute('data-label')||'';if(!base)return;
      mag.hideAll();updateImages(base,label);
      await Promise.all([
        loadViewer(predFrame,predBanner,base,'scene-pred.viser',cameraFromButton(button,'pred'),true),
        loadViewer(gtFrame,gtBanner,base,'scene-gt.viser',cameraFromButton(button,'gt'),true)
      ]);
    }
    thumbs.forEach(function(b,i){b.addEventListener('click',function(){activate(i)})});
    container.querySelectorAll('.interactive-arrow').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var dir=a.dataset.direction==='prev'?-1:1,next=active<0?(dir<0?thumbs.length-1:0):(active+dir+thumbs.length)%thumbs.length;activate(next);if(thumbs[next])thumbs[next].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'})})});
    return {activate:activate,getActiveIndex:function(){return active}};
  }

  var droidApi=initOneCarousel({container:document.getElementById('interactive-row-droid'),thumbRowSelector:'#interactive-thumb-row-droid',dotsSelector:'#interactive-dots-droid',inputsCardId:'interactive-inputs-droid',imageRoles:['rgb0','depth0','rgb1','depth1']});
  var b1kApi=initOneCarousel({container:document.getElementById('interactive-row-b1k'),thumbRowSelector:'#interactive-thumb-row-b1k',dotsSelector:'#interactive-dots-b1k',inputsCardId:'interactive-inputs-b1k',imageRoles:['rgb0','rgb1','rgb2','depth0','depth1','depth2']});
  function showInputs(which){
    var d=which==='droid', droidInputs=document.getElementById('interactive-inputs-droid'), b1kInputs=document.getElementById('interactive-inputs-b1k');
    if(droidInputs)droidInputs.classList.toggle('is-hidden',!d);
    if(b1kInputs)b1kInputs.classList.toggle('is-hidden',d);
  }
  showInputs('droid');
  if(droidApi)droidApi.activate(0);
  document.getElementById('interactive-row-droid')?.addEventListener('click',function(e){if(e.target.closest('.interactive-thumb'))showInputs('droid')});
  document.getElementById('interactive-row-b1k')?.addEventListener('click',function(e){if(e.target.closest('.interactive-thumb'))showInputs('b1k')});

  // Dataset comparison section.
  (function initDataset(){
    var section=document.getElementById('dataset');if(!section)return;
    var thumbs=Array.from(section.querySelectorAll('.dataset-thumb')),row=section.querySelector('#dataset-thumb-row'),dotsBox=section.querySelector('#dataset-dots'),active=-1,dots=[];
    var ours=document.getElementById('dataset-viewer-ours'),orig=document.getElementById('dataset-viewer-original'),oursBanner=getViewerBanner(ours),origBanner=getViewerBanner(orig);
    if(ours){ours.removeAttribute('src');ours.dataset.base=''}if(orig){orig.removeAttribute('src');orig.dataset.base=''}setViewerBanner(oursBanner,true);setViewerBanner(origBanner,true);setViewerHintVisible(ours,false);setViewerHintVisible(orig,false);
    var imageMap={
      'ours-rgb-0':section.querySelector('[data-dataset-role="ours-rgb-0"]'),'ours-depth-0':section.querySelector('[data-dataset-role="ours-depth-0"]'),
      'ours-rgb-1':section.querySelector('[data-dataset-role="ours-rgb-1"]'),'ours-depth-1':section.querySelector('[data-dataset-role="ours-depth-1"]'),
      'original-rgb-0':section.querySelector('[data-dataset-role="original-rgb-0"]'),'original-depth-0':section.querySelector('[data-dataset-role="original-depth-0"]'),
      'original-rgb-1':section.querySelector('[data-dataset-role="original-rgb-1"]'),'original-depth-1':section.querySelector('[data-dataset-role="original-depth-1"]')
    };
    createMagnifier(imageMap,Object.keys(imageMap));
    if(dotsBox){dotsBox.innerHTML='';dots=thumbs.map(function(_,idx){var d=document.createElement('button');d.type='button';d.className='carousel-dot';d.setAttribute('aria-label','Show dataset sample '+(idx+1));d.addEventListener('click',function(){activate(idx)});dotsBox.appendChild(d);return d})}
    function updateImages(base,label){
      var map=[
        ['ours-rgb-0','/fs-refined/rgb_robot/cam0.png'],['ours-depth-0','/fs-refined/depth/cam0.png'],['ours-rgb-1','/fs-refined/rgb_robot/cam1.png'],['ours-depth-1','/fs-refined/depth/cam1.png'],
        ['original-rgb-0','/raw-tri/rgb_robot/cam0.png'],['original-depth-0','/raw-tri/depth/cam0.png'],['original-rgb-1','/raw-tri/rgb_robot/cam1.png'],['original-depth-1','/raw-tri/depth/cam1.png']
      ];map.forEach(function(m){if(imageMap[m[0]]){imageMap[m[0]].src=base+m[1];imageMap[m[0]].alt=(label||'Dataset')+' '+m[0]}});
    }
    async function activate(idx){
      if(idx<0||idx>=thumbs.length)return;active=idx;thumbs.forEach(function(b,i){b.classList.toggle('is-active',i===idx);b.setAttribute('aria-pressed',i===idx?'true':'false')});dots.forEach(function(d,i){d.classList.toggle('is-active',i===idx)});
      var button=thumbs[idx],base=button.dataset.base,label=button.dataset.label||'',cam=cameraFromButton(button);updateImages(base,label);
      await Promise.all([loadViewer(ours,oursBanner,base,'scene-fs-refined.viser',cam,false),loadViewer(orig,origBanner,base,'scene-raw-tri.viser',cam,false)]);
    }
    thumbs.forEach(function(b,i){b.addEventListener('click',function(){activate(i)})});
    section.querySelectorAll('.dataset-arrow').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var dir=a.dataset.direction==='prev'?-1:1,next=active<0?(dir<0?thumbs.length-1:0):(active+dir+thumbs.length)%thumbs.length;activate(next);if(thumbs[next])thumbs[next].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'})})});
  })();
});
