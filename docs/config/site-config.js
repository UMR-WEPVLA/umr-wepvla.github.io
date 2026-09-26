window.PAPER_CONTENT = {
  titleHtml: "UMR: Universal Manipulation Representation",
  authorsHtml: `
    <span class="author-block"><strong>Song Liu</strong><sup>1,2,*</sup>,</span>
    <span class="author-block"><strong>Linyi Li</strong><sup>1,2,*</sup></span><br>
    <span class="author-block">Yanshun Zhao<sup>1</sup>,</span>
    <span class="author-block">Rxuan Li<sup>1</sup>,</span>
    <span class="author-block">Xinrui Xu<sup>1</sup>,</span>
    <span class="author-block">Yi Ju<sup>1</sup>,</span>
    <span class="author-block">Yahui Deng<sup>1</sup>,</span>
    <span class="author-block">Senge Zhang<sup>1</sup>,</span>
    <span class="author-block">Guoyu Liu<sup>1</sup>,</span>
    <span class="author-block">Yixuan Li<sup>1</sup>,</span><br>
    <span class="author-block">Wuyang Zhang<sup>1,2</sup>,</span>
    <span class="author-block">Yao Li<sup>1</sup>,</span>
    <span class="author-block">Congcong Zhu<sup>1,2</sup>,</span>
    <span class="author-block">Jingrun Chen<sup>1,&dagger;</sup></span>
  `,
  affiliationHtml: `
    <span class="affiliation-block"><sup>1</sup>University of Science and Technology of China, Hefei, China.</span><br>
    <span class="affiliation-block"><sup>2</sup>Suzhou Artificial Intelligence Laboratory, Suzhou, China.</span>
  `,
  affiliationNoteHtml: `<sup>*</sup> Equal contribution. <sup>&dagger;</sup> Corresponding author.`,
  links: {
    pdf: "ICRA_UMR_manuscript_V10_Compressed.pdf",
    arxiv: "#",
    explainer: "#",
    talk: "#",
    tldr: "#",
    code: "https://github.com/LiuSong-Scrat/UMR.git",
    results: "benchmark-results/",
    checkpoints: "https://pan.baidu.com/s/1mb9H1LpiZQoeJ-i4ojtBgQ?pwd=urbq"
  },
  teaserCaption: "UMR couples embodiment-agnostic World Flow with locally executable Ego Trajectory, enabling a single policy trained on human demonstrations to transfer zero-shot across robot embodiments and deployment conditions.",
  abstractHtml: `General-purpose embodied manipulation requires a unified action representation that generalizes across embodiments and scales with heterogeneous demonstrations. We introduce <strong>Universal Manipulation Representation (UMR)</strong>, which decomposes manipulation into two functionally distinct but geometrically linked components: embodiment-agnostic <strong>World Flow</strong>, describing task-relevant object motion in the world frame, and <strong>Ego Trajectory</strong>, representing end-effector motion relative to its current pose. The two components are coupled by an SE(3) conjugate transformation. We instantiate UMR as <strong>World–Ego Point VLA (WEPVLA)</strong>, a compact 0.5B-parameter point-cloud policy with a dual-stream Point Action Adapter and a shared Point Action Expert. A <strong>Data-Efficient Strategy (DES)</strong> further diversifies object configurations through stage-aware point-cloud editing while preserving demonstrated contact geometry. WEPVLA achieves 85.7% on the 10-task RLBench benchmark and 97.5% across LIBERO's four suites. In real-world experiments, one policy trained with approximately 10 minutes of human demonstrations per task and no robot demonstrations achieves 91.7% average success across six settings, compared with 60.8% for HumanEgo.`,
  walkthroughMode: "local",
  walkthroughYoutubeEmbed: "https://www.youtube-nocookie.com/embed/VIDEO_ID",
  interactiveIntroHtml: `Explore RH20T point-cloud examples derived from the UMR preprocessing pipeline. Each scene compares a single-view pixel-filtered point cloud against a multiview reconstruction for the same frame.`,
  interactiveNoteHtml: `<strong>NOTE:</strong> The interactive viewer uses bundled PLY review samples. Prediction shows single-view filtering; the reference viewer shows multiview reconstruction.`,
  datasetTitleHtml: `World-Ego Point Cloud Review`,
  datasetIntro1Html: `The review bundle covers cfg2-cfg7 RH20T episodes and exports aligned RGB frames, image-space comparisons, and binary PLY point clouds for visual inspection.`,
  datasetIntro2Html: `For each selected episode, the site loads the same frame as two coupled 3D views: single-view filtering and multiview reconstruction. This makes geometry, density, and virtual-gripper consistency easy to inspect before release.`,
  experimentsIntroHtml: `A single WEPVLA policy is trained from approximately 10 minutes of human demonstrations per task and no robot demonstrations. It transfers zero-shot across six settings spanning Piper and Franka robots, viewpoints, scenes, gripper geometries, object heights, and disturbances, achieving 91.7% average success versus 60.8% for HumanEgo.`
};
