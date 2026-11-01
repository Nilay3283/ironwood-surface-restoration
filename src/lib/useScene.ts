import { useEffect, useState } from 'react';
import { sceneURL, type SceneOpts } from './textures';

/** Returns a URL for a procedurally rendered scene, or a real photo when `photo` is supplied. */
export function useScene(opts: SceneOpts, photo?: string) {
  const [url, setUrl] = useState<string | undefined>(photo);
  const key = JSON.stringify(opts);
  useEffect(() => {
    if (photo) return setUrl(photo);
    let live = true;
    sceneURL(opts).then((u) => live && setUrl(u));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, photo]);
  return url;
}
