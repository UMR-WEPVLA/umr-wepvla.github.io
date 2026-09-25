#!/usr/bin/env python3
"""Local Open3D viewer for an extracted RH20T pixel-filter review bundle."""
import argparse
import json
from pathlib import Path


def main():
    import open3d as o3d

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bundle', type=Path, default=Path(__file__).resolve().parent)
    args = parser.parse_args()
    root = args.bundle.resolve()
    entries = json.loads((root / 'catalog.json').read_text())['frames']
    state = {'index': 0, 'method': 'single_view', 'cloud': None}
    vis = o3d.visualization.VisualizerWithKeyCallback()
    if not vis.create_window(window_name='RH20T PLY review | 1 single / 2 multi | N next / P previous', width=1440, height=900):
        raise RuntimeError('Open3D window unavailable; run this viewer on your local desktop')
    vis.get_render_option().point_size = 2.0

    def show(reset):
        entry = entries[state['index']]
        path = root / entry[state['method']]
        view = vis.get_view_control()
        camera = view.convert_to_pinhole_camera_parameters() if state['cloud'] is not None else None
        if state['cloud'] is not None:
            vis.remove_geometry(state['cloud'], reset_bounding_box=False)
        state['cloud'] = o3d.io.read_point_cloud(str(path))
        vis.add_geometry(state['cloud'], reset_bounding_box=reset)
        if not reset and camera is not None:
            view.convert_from_pinhole_camera_parameters(camera, allow_arbitrary=True)
        print(f"[{state['index']+1}/{len(entries)}] {entry['scene']} frame={entry['frame']} "
              f"source={entry['source_color_index']} {state['method']} "
              f"vertices={len(state['cloud'].points)} (last 500 = virtual gripper)", flush=True)
        vis.update_renderer()
        return False

    def select(method):
        def callback(_):
            state['method'] = method
            return show(False)
        return callback

    def move(delta):
        def callback(_):
            state['index'] = (state['index'] + delta) % len(entries)
            return show(True)
        return callback

    vis.register_key_callback(ord('1'), select('single_view'))
    vis.register_key_callback(ord('2'), select('multiview'))
    vis.register_key_callback(ord('N'), move(1))
    vis.register_key_callback(ord('P'), move(-1))
    print('Mouse: orbit/pan/zoom. 1/2: switch filters with the same view. N/P: next/previous frame.', flush=True)
    show(True)
    try:
        vis.run()
    finally:
        vis.destroy_window()


if __name__ == '__main__':
    main()
