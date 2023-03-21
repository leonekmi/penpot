import Matrix from './Matrix';
import TransformInput from './TransformInput';
import TransformOutput from './TransformOutput';

export const transformInput: TransformInput = new TransformInput();
export const transformOutput: TransformOutput = new TransformOutput();

export const matrix: Matrix = new Matrix()

export function move(): void {
  Matrix.multiply(
    transformOutput.transform,
    transformInput.matrix,
    matrix
      .identity()
      .setTranslation(transformInput.vector)
  )
}

export function resize(): void {
  if (transformInput.shouldTransform) {
    transformInput.origin.transform(transformInput.transformInverse)
  }

  matrix.identity()

  if (transformInput.shouldTransform) {
    matrix.multiply(transformInput.transform)
  }

  matrix
    .translate(transformInput.origin)
    .scale(transformInput.vector)
    .translate(transformInput.origin.negate())

  if (transformInput.shouldTransform) {
    matrix.multiply(transformInput.transformInverse)
  }

  Matrix.multiply(transformOutput.transform, transformInput.matrix, matrix.identity())

  /*
    (let [tf (dm/get-prop modifier :transform)
                      tfi    (dm/get-prop modifier :transform-inverse)
                      vector (dm/get-prop modifier :vector)
                      origin (dm/get-prop modifier :origin)
                      origin (if ^boolean (some? tfi)
                               (gpt/transform origin tfi)
                               origin)]

                  (gmt/multiply!
                   (-> (gmt/matrix)
                       (cond-> ^boolean (some? tf)
                         (gmt/multiply! tf))
                       (gmt/translate! origin)
                       (gmt/scale! vector)
                       (gmt/translate! (gpt/negate origin))
                       (cond-> ^boolean (some? tfi)
                         (gmt/multiply! tfi)))
                   matrix))
  */
}

export function rotate(): void {
  matrix
    .identity()
    .translate(transformInput.center)
    .rotate(transformInput.rotation)
    .translate(transformInput.center.negate())

  Matrix.multiply(transformOutput.transform, matrix, transformInput.transform)
  /*
(let [center   (dm/get-prop modifier :center)
      rotation (dm/get-prop modifier :rotation)]
                  (gmt/multiply!
                   (-> (gmt/matrix)
                       (gmt/translate! center)
                       (gmt/multiply! (gmt/rotate-matrix rotation))
                       (gmt/translate! (gpt/negate center)))
                   matrix))
                   */
}
