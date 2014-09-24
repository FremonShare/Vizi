BUILDDIR=../build
TARGET="$BUILDDIR/vizi-nodeps.min.js"
OUTPUT="$BUILDDIR/vizi.min.js"
THREE=../libs/three.js.r66/three.min.js
STATS=../libs/three.js.r66/stats.min.js
LOADERS="../libs/three.js.r66/loaders/ColladaLoader.js \
../libs/three.js.r66/loaders/glTF/glTF-parser.js \
../libs/three.js.r66/loaders/glTF/glTFLoader.js \
../libs/three.js.r66/loaders/glTF/glTFLoaderUtils.js \
../libs/three.js.r66/loaders/glTF/glTFAnimation.js \
../libs/three.js.r66/postprocessing/BloomPass.js \
../libs/three.js.r66/postprocessing/EffectComposer.js \
../libs/three.js.r66/postprocessing/FilmPass.js \
../libs/three.js.r66/postprocessing/MaskPass.js \
../libs/three.js.r66/postprocessing/RenderPass.js \
../libs/three.js.r66/postprocessing/ShaderPass.js \
../libs/three.js.r66/shaders/ConvolutionShader.js \
../libs/three.js.r66/shaders/CopyShader.js \
../libs/three.js.r66/shaders/DotScreenShader.js \
../libs/three.js.r66/shaders/DotScreenRGBShader.js \
../libs/three.js.r66/shaders/FilmShader.js \
../libs/three.js.r66/shaders/RGBShiftShader.js \
../libs/oculus/VREffect.js \
../libs/oculus/VRControls.js \
../libs/ParticleEngine/ShaderParticles.min.js"

RAF=../libs/requestAnimationFrame/RequestAnimationFrame.js
MOUSEWHEEL=../libs/jquery-mousewheel-3.0.4/jquery.mousewheel.js
TWEEN=../libs/tween.js/tween.min.js
LIBS="$THREE $STATS $LOADERS $TWEEN $RAF"
NODEPS=../src/config/nodeps.js
FLAGS='--language_in=ECMASCRIPT5'

$CLOSURE_PATH/closure/bin/build/closurebuilder.py --root=$CLOSURE_PATH  --root=../src/animations --root=../src/behaviors --root=../src/cameras --root=../src/controllers --root=../src/config --root=../src/core  --root=../src/events --root=../src/graphics --root=../src/helpers --root=../src/input --root=../src/lights  --root=../src/loaders --root=../src/objects --root=../src/particles --root=../src/postprocessing --root=../src/prefabs --root=../src/scene --root=../src/scripts --root=../src/system --root=../src/time --root=../src/viewer --namespace="Vizi" --namespace="Vizi.Object" --namespace="Vizi.Modules" --output_mode=compiled --compiler_flags=$FLAGS --compiler_jar=compiler.jar --output_file=$TARGET
cat $LIBS $NODEPS $TARGET > $OUTPUT
