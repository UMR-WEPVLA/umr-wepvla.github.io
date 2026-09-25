# RH20T 单相机像素过滤 PLY 对照包

覆盖 cfg2～7，7 个完整 episode，每个导出首/中/末 3 帧，共 21 组、42 个 PLY。
cfg2 task69 使用 task_0069_user_0014_scene_0009_cfg_0002。
按 cfg / 完整 episode 名 / 输出帧编号和原视频帧编号组织；catalog.json 可自动定位。

## 本地查看

解压后在本目录执行（使用已有 Open3D 环境）：

    python view_ply.py --bundle .

按 1 查看 single_view，按 2 查看 multiview，切换方法时保持视角；N 下一帧，P 上一帧。
鼠标旋转、平移、缩放。也可直接用 CloudCompare/MeshLab 打开 PLY，无需此脚本。
comparison.png 为同一主相机视角的 CPU 点云投影，仅作快速预览，不能替代旋转 PLY 检查飞点。
rgb.png 是对应原始 RGB 帧；正常 RGB 通道，无 VSCode 视频解码色偏。

## 文件及算法

- single_view.ply：同一主相机同一帧，深度 100～5000 mm；8 像素邻居至少 3 个深度差
  <= max(15 mm, 1.5% 深度)；5x5 深度中值偏差 <= max(20 mm, 2% 深度)；
  剩余有效像素的 8 连通区域至少 64 像素。投影成真实点后裁剪、最后无放回随机采样。
  最多 49,500 场景点，不足时保留实际数量，无重复补齐、无插值和随机坐标填充。
- multiview.ply：重算同帧的现行 GPU 多相机算法，保留原有提前补点及最终补点行为，
  为 49,500 场景条目（包含重复）。用于对照，未改变现行生产版本。
- 两者均为当前 achieved physical EEF 坐标系，米，float32 XYZ + uint8 RGB；
  裁剪均沿用 EEF z <= 0.4 m，没有新增工作区盒子。
- 两者最后 500 点为相同已接受标定的红色虚拟夹爪，属于合成几何，不计入真实场景点数。
- 同帧两种 PLY 的夹爪坐标逐点一致，single_view 导出场景 XYZ 无重复，坐标有限、
  PLY 声明点数与文件数据一致，已通过程序检查。成像质量等待人工视觉检查。
- 这不是已批准的 LeRobot 数据集，不替换生产过滤算法，也不更新原标定接受记录。

## 计时口径

timings.csv / timings.json：每个 episode 都处理了完整 10 Hz 序列，沿用用户选择的
视频 25 FPS 等距保留 40% 时间基准；并非只处理 3 帧后推算。
full_episode_including_fsync_seconds 包括读取元数据/同步与位姿审计、单主相机 RGB-D
解码、过滤、无放回采样、虚拟夹爪生成、所有帧二进制 PLY 写入本地 /tmp 和文件 fsync。
首次 Python/依赖导入、LeRobot 打包、最终数据集严格校验、NFS 发布不包含在此时间中。
three_frame_controls_and_review_export_seconds 单独记录 3 帧多相机对照重算及导出耗时。
临时完整序列 PLY 在保存三帧 review 文件与逐帧记录后释放，包中仅保留 review 文件。
测试为单进程、CPU affinity 40、数值库/OpenCV 单线程；单相机阶段不使用 GPU。
多相机对照使用 cuda:3。原批任务同时运行，缓存状态未清空；这些是本次实测，非吞吐极限。
每个 episode 的 report.json 保存逐帧数量、源帧/时间戳、同步、位姿审计、相机 IO 及计时。

## 本次实测

| cfg | episode | 10 Hz 帧数 | 场景点数范围 | 完整点云预处理秒数（含本地 fsync） |
|---|---|---:|---:|---:|
| 2 | task_0001_user_0002_scene_0001_cfg_0002 | 154 | 42812～45049 | 11.07 |
| 2 | task_0069_user_0014_scene_0009_cfg_0002 | 111 | 44758～48145 | 6.54 |
| 3 | task_0021_user_0010_scene_0001_cfg_0003 | 120 | 49500～49500 | 27.83 |
| 4 | task_0013_user_0007_scene_0001_cfg_0004 | 100 | 49500～49500 | 21.89 |
| 5 | task_0001_user_0007_scene_0001_cfg_0005 | 77 | 49500～49500 | 18.36 |
| 6 | task_0001_user_0014_scene_0001_cfg_0006 | 94 | 49500～49500 | 14.84 |
| 7 | task_0001_user_0014_scene_0001_cfg_0007 | 34 | 49500～49500 | 4.87 |
