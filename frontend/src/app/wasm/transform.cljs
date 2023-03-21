(ns app.wasm.transform
  (:require
   [app.util.wasm :as wasm]
   [app.util.wasm.types :as types]
   [promesa.core :as p]))

(defonce instance (atom nil))
(defonce memory (atom nil))
(defonce transform-input (atom nil))
(defonce transform-output (atom nil))

(defn- init-proxies
  [asm]
  (js/console.log "init transform proxies")
  (reset! transform-input (types/from asm "transformInput" "TransformInput"))
  (reset! transform-output (types/from asm "transformOutput" "TransformOutput")))

(defn transform-move
  [shape point point-snap lock? center?]
  (let [{:keys [x y width height]} (:selrect shape)
        {:keys [rotation]} shape
        transform-input @transform-input]
    (set! (.. ^js transform-input -rotation) (or rotation 0))
    (set! (.. ^js transform-input -vector) (if lock? 1 0))
    (set! (.. ^js transform-input -origin) (if center? 1 0))
    (set! (.. ^js transform-input -center -position -x) x)
    (set! (.. ^js transform-input -selRect -position -y) y)
    (set! (.. ^js transform-input -selRect -size -x) width)
    (set! (.. ^js transform-input -selRect -size -y) height)
    (set! (.. ^js transform-input -current -x) (:x point))
    (set! (.. ^js transform-input -current -y) (:y point))
    (set! (.. ^js transform-input -snap -x) (:x point-snap))
    (set! (.. ^js transform-input -snap -y) (:y point-snap))
    (set! (.. ^js transform-input -shouldTransform) (if (some? (:transform shape)) 1 0)))
    (. @instance move))

(defn init!
  "Loads WebAssembly module"
  []
  (p/then
   (wasm/load "wasm/transform.debug.wasm")
   (fn [asm]
     (js/console.log asm)
     (reset! instance asm)
     (reset! memory asm.memory)
     (init-proxies asm))))
