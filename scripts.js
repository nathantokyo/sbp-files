(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function startHeader() {
  var settings = {
    yOffset: 1,
    pivotOffset: [0.15, 0.1, -0.66],
    slideTimeout: 500 // transitionDuration: 2000,

  };
  window.state = {
    stateNames: ["loading", "intro", "state1", "state2", "state3", "done"]
  }; // Scene

  var initCamera = function initCamera() {
    state.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // state.camera = new THREE.PerspectiveCamera(30, window.innerWidth/window.innerHeight, 0.1, 1000);

    state.camera.position.z = 5;
  };

  var initRenderer = function initRenderer() {
    state.canvas = document.getElementById("header-canvas");
    state.renderer = new THREE.WebGLRenderer({
      canvas: state.canvas,
      alpha: true,
      antialias: true
    });
    state.renderer.setClearColor(0x000000, 0);
    state.renderer.toneMapping = THREE.LinearToneMapping;
    state.renderer.toneMappingExposure = 1;
    state.renderer.domElement.style.background = 'transparent';
    state.renderer.shadowMap.enabled = true;
    state.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  };

  var initLighting = function initLighting() {
    state.lights = {}; // Consider converting to rect lights
    // Add ambient light

    var ambientLight = new THREE.AmbientLight(0x404090, 3); // Color, intensity

    state.scene.add(ambientLight);
    state.lights.ambientLight = ambientLight; // Add directional light 1

    var light1 = new THREE.DirectionalLight(0xffffff, 1.0); // Color, intensity

    light1.position.set(1, 0.6, 0.9); // X, Y, Z coordinates

    state.scene.add(light1);
    state.lights.light1 = light1; // Add directional light 2

    var light2 = new THREE.DirectionalLight(0xffffff, 0.5); // Color, intensity

    light2.position.set(-1, -0.25, 0.25); // X, Y, Z coordinates

    state.scene.add(light2);
    state.lights.light2 = light2; // // Add purple point light

    var purpleLight = new THREE.PointLight(0xff6080, 0.5); // Color, intensity, distance

    purpleLight.position.set(0, -1, 0); // X, Y, Z coordinates

    state.scene.add(purpleLight);
    state.lights.purpleLight = purpleLight; // Set up shadows

    var shadowIntensity = 0.5; // between 0 and 1

    var light1clone = light1.clone();
    var baseIntensity = light1.intensity;
    light1.intensity = baseIntensity * shadowIntensity;
    light1clone.intensity = baseIntensity * (1 - shadowIntensity);
    state.scene.add(light1clone);
    light1.castShadow = true;
    light1clone.castShadow = false;
    light1.shadow.mapSize.width = 4096;
    light1.shadow.mapSize.height = 4096; // light1.shadow.radius = 300; 

    state.lights.light1clone = light1clone;
  };

  var initScene = function initScene() {
    state.scene = new THREE.Scene();
    initCamera();
    initRenderer();
    initLighting();
  }; // Mouse Controls


  var initMouse = function initMouse() {
    state.mouse = {
      x: 0.5,
      y: 0.5
    };
    state.mouseTarget = {
      x: 0.5,
      y: 0.5
    };
    window.addEventListener('mousemove', function (event) {
      state.mouseTarget = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight
      };
    });
  };

  var updateMouse = function updateMouse() {
    state.mouse = {
      x: state.mouse.x + (state.mouseTarget.x - state.mouse.x) * 0.05,
      y: state.mouse.y + (state.mouseTarget.y - state.mouse.y) * 0.05
    };
  }; // Model


  var initModel = function initModel() {
    state.gltf = null;
    state.glScene = null;
    state.pivot = new THREE.Object3D();
    state.scene.add(state.pivot);
    var modelHover = document.getElementById("modelhover");
    modelHover.addEventListener("mouseover", function (e) {// if(state.active == "intro") transitionToState("hover");
    });
    modelHover.addEventListener("mouseleave", function (e) {// if(state.active == "hover") transitionToState("intro");
    });
    state.logoSize = 1;
  };

  var loadModel = function loadModel(onComplete) {
    var loader = new THREE.GLTFLoader();

    var onLoaded = function onLoaded(gltf) {
      // Model
      state.gltf = gltf;
      var glScene = gltf.scene;
      state.glScene = glScene; // Pivot

      state.pivot.add(state.glScene);
      state.pivot.position.set(settings.pivotOffset[0], settings.pivotOffset[1], settings.pivotOffset[2]);
      state.glScene.position.set(-settings.pivotOffset[0] - 0.035, -settings.pivotOffset[1] - 0.135, -settings.pivotOffset[2]); // Child models

      state.models = {};
      state.materials = {};

      var initModel = function initModel(name, model) {
        state.models[name] = {
          main: model,
          wrap: new THREE.Object3D(),
          offset: 0.1
        };
        state.materials[name] = model.material;
        model = state.models[name];
        model.wrap.position.copy(model.main.position);
        state.models[name].rootPosition = model.wrap.position.clone();
        state.models[name].targetPosition = model.wrap.position.clone();
        var existingParent = model.main.parent;

        if (existingParent) {
          existingParent.remove(model.main);
          existingParent.add(model.wrap);
        }

        model.wrap.add(model.main);
        model.main.position.set(0, 0, 0);
      };

      initModel("logo", state.glScene.children[1]);
      initModel("bit", state.glScene.children[0]); // Model Settings

      state.models.bit.main.castShadow = true;
      state.models.logo.main.receiveShadow = true; // Material Settings

      state.materials.logo.transparent = true;
      state.materials.logo.opacity = 0;
      state.materials.logo.metalness = 0.7;
      state.materials.logo.roughness = 0.75;
      state.materials.logo.reflectivity = 0.7;
      state.materials.logo.side = THREE.FrontSide;
      state.materials.bit.transparent = true;
      state.materials.bit.metalness = 0.7;
      state.materials.bit.roughness = 0.5;
      state.materials.bit.opacity = 0;
      state.materials.bit.side = THREE.FrontSide; // state.materials.bit.roughness = 0.5;
      // state.materials.bit.reflectivity = 0;
      // state.materials.bit.color.setHex(0x808080);
      // Custom logo shader

      initCustomLogoShader(); // Create area light

      var width = 2;
      var height = 1.8;
      state.logoLight = new THREE.RectAreaLight(0x000000, 0, width, height);
      var rectLightHelper = new THREE.RectAreaLightHelper(state.logoLight);
      state.models.logo.main.add(state.logoLight);
      var angle = Math.PI / 2;
      state.logoLight.position.set(0.043, 0.001, -0.04);
      state.logoLight.rotation.set(angle, 0, 0); // state.scene.add(rectLightHelper);

      console.log(state);
      onComplete();
    };

    loader.load('https://uploads-ssl.webflow.com/61da11fb945a0b2c5041d4e0/6433f5eebbc6d186d6190cfd_model_gr.glb.txt', onLoaded);
  };

  var initCustomLogoShader = function initCustomLogoShader() {
    var generateGaussianKernel = function generateGaussianKernel(size, sigma) {
      var kernel = [];
      var halfSize = Math.floor(size / 2);
      var sigmaSquared = sigma * sigma;
      var denom = 1.0 / (2.0 * Math.PI * sigmaSquared);
      var sum = 0;

      for (var y = -halfSize; y <= halfSize; y++) {
        for (var x = -halfSize; x <= halfSize; x++) {
          var weight = denom * Math.exp(-(x * x + y * y) / (2.0 * sigmaSquared));
          kernel.push(weight);
          sum += weight;
        }
      }

      return kernel.map(function (value) {
        return value / sum;
      });
    }; // Create custom uniforms


    state.logoUniforms = {
      col1: {
        value: new THREE.Color(0.0, 0.0, 1.0)
      },
      col2: {
        value: new THREE.Color(0.75, 0.75, 0.75)
      }
    };

    state.materials.logo.onBeforeCompile = function (shader) {
      // Add custom uniforms to the shader
      shader.uniforms.col1 = state.logoUniforms.col1;
      shader.uniforms.col2 = state.logoUniforms.col2; // Modify the shader's fragment code

      shader.fragmentShader = "\n        uniform vec3 col1;\n        uniform vec3 col2;\n      " + shader.fragmentShader; // Apply custom texture processing

      shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', "\n          #include <map_fragment>\n\n          // Apply changes to the sampled texture\n          vec4 customTexture = texture2D( map, vUv );\n          \n          customTexture.rgb = mix(col1, col2, smoothstep(0.2, 0.8, (customTexture.r - customTexture.g + 1.0)/2.0) );\n\n          customTexture.a *= opacity;\n          \n          diffuseColor = customTexture;\n        ");
    };
  };

  var floatMainModel = function floatMainModel(model, rate, distance) {
    var moveAxis = new THREE.Vector3(0, 0, 1);
    var target = Math.sin(state.t * rate) * distance + model.offset;
    model.main.translateOnAxis(moveAxis, target - model.main.position.z);
  };

  var rotatePivot = function rotatePivot() {
    var x = (state.mouse.x - 0.5) * 10 + Math.sin(state.t / 2000) * -5;
    var y = (state.mouse.y - 0.5) * 10 + Math.sin((state.t + 1500) / 3500) * -5;
    state.pivot.rotation.set(THREE.MathUtils.degToRad(y), THREE.MathUtils.degToRad(x), 0);
    state.pivot.scale.set(state.logoSize, state.logoSize, state.logoSize);
  }; // Planes


  var initPlanes = function initPlanes() {
    state.planes = {};
    state.textureLoader = new THREE.TextureLoader();
    state.circleSize = 0.3;
    state.circleOpacity = 1; // Gradient

    createPlane("grad", '/images/Header_Gradient.png');
    state.planes.grad.material.transparent = true; // Circle

    createPlane("circle", '/images/Header_Circle.png');
    state.planes.circle.material.transparent = true; // Glow

    createPlane("glow", '/images/Header_Circle-GLOW.png');
    state.planes.glow.material.transparent = true;
    state.go = Math.random() * 100;
    resizePlanes();
  };

  var createPlane = function createPlane(id, texture) {
    var imageTexture = state.textureLoader.load(texture);
    var material = new THREE.MeshBasicMaterial({
      map: imageTexture
    });
    var geometry = new THREE.PlaneGeometry(1, 1);
    state.planes[id] = new THREE.Mesh(geometry, material);
    state.scene.add(state.planes[id]);
  };

  var resizePlanes = function resizePlanes() {
    var cameraZPosition = state.camera.position.z;
    var fovInRadians = state.camera.fov * Math.PI / 180;
    var aspectRatio = window.innerWidth / window.innerHeight; // // BG Plane (cover)
    // let planeHeight = 2 * Math.tan(fovInRadians / 2) * cameraZPosition;
    // let planeWidth = 1;
    // if(state.bgAspectRatio < aspectRatio){
    //   planeWidth = planeHeight * aspectRatio;
    //   planeHeight = planeWidth / state.bgAspectRatio;
    // } else {
    //   planeWidth = planeHeight * state.bgAspectRatio;  
    // }
    // state.planes.bg.position.z = -cameraZPosition + 0.1;
    // state.planes.bg.scale.set( planeWidth*2, planeHeight*2, 1);
    // Circle Plane

    state.planes.circle.position.z = -cameraZPosition + 0.1; // Grad Plane

    state.planes.grad.position.z = -cameraZPosition + 0.1; // Grad Plane

    state.planes.glow.position.z = 1;
  };

  var updatePlanes = function updatePlanes() {
    // Size
    var cs = state.circleSize;
    var csp = state.circleSize < 1 ? Math.pow(cs, 2) : state.circleSize;
    state.planes.grad.scale.set(csp * 3.8, csp * 3.8, 1);
    state.planes.circle.scale.set(cs * 2.5, cs * 2.5, 1);
    state.planes.glow.scale.set(cs * 1.015, cs * 1.015, 1); // Opacity

    state.planes.circle.material.opacity = state.circleOpacity;
    state.planes.glow.material.opacity = state.circleOpacity;
    state.planes.grad.material.opacity = state.circleOpacity; // grad rotation

    if (state.updateGrad) {
      var t = state.t + state.go;
      state.planes.grad.rotation.z = -t / 4500;
      state.planes.grad.position.x = Math.sin(t / 5000) * 0.03;
      state.planes.grad.position.y = Math.sin(t / 3500) * 0.03; // var s = Math.sin(t/300);

      var sx = (1 + Math.sin(t / 3000) * 0.05) * 3.8;
      var sy = (1 + Math.sin(t / 5500) * 0.05) * 3.8;
      state.planes.grad.scale.set(csp * sx, csp * sy, 1);
    } // BG
    // if(state.bgLight != state._bgLight){
    //   state.planes.bg.material.map = state.bgLight ? state.bgLightImage : state.bgDarkImage;
    //   state.planes.bg.material.needsUpdate = true;
    //   state._bgLight = state.bgLight;
    // }

  };

  var copyCanvas = function copyCanvas() {
    // get the source and destination canvas elements
    var canvas1 = document.getElementById('header-canvas');
    var canvas2 = document.getElementById('header-canvas-back'); // var s = canvas1.height/4;
    // var d = s * 0.70;
    // canvas2.width = d;
    // canvas2.height = d;
    // var ctx2 = canvas2.getContext('2d');
    // ctx2.drawImage(canvas1, -canvas1.width/8 + s*0.35, -s*0.15, canvas1.width/4, canvas1.height/4);

    var s = canvas1.height / 4;
    canvas2.width = s;
    canvas2.height = s;
    var ctx2 = canvas2.getContext('2d');
    ctx2.drawImage(canvas1, 0, 0, s, s);
  }; // Animate


  var animate = function animate() {
    requestAnimationFrame(animate);
    state.t = Date.now();
    TWEEN.update();
    updateMouse();
    floatMainModel(state.models.bit, 1 / 1000, 0.01);
    floatMainModel(state.models.logo, 1 / 1500, 0.01);
    rotatePivot();
    updatePlanes();
    state.renderer.render(state.scene, state.camera);
    copyCanvas();
  }; // Resize


  var resize = function resize() {
    // Get the new width and height of the browser window
    var width = window.innerWidth;
    var height = window.innerHeight; // Update the camera's aspect ratio and projection matrix
    // state.camera.aspect = width / height;
    // state.camera.updateProjectionMatrix();
    // Update the renderer's size
    // state.renderer.setSize(width, height);

    state.renderer.setPixelRatio(window.devicePixelRatio);
    state.size = window.innerHeight;
    state.renderer.setSize(state.size, state.size);
    resizePlanes();
  }; // State Transitions


  var initStateDebug = function initStateDebug() {
    var controls = document.getElementById("controls");
    if (!controls) return;

    for (var i = 0; i < controls.children.length; i++) {
      var child = controls.children[i];
      child.addEventListener("click", transitionToState.bind(null, child.innerHTML));
    }
  };

  var highlightStateDebug = function highlightStateDebug(stateName) {
    var controls = document.getElementById("controls");
    if (!controls) return;

    for (var i = 0; i < controls.children.length; i++) {
      var child = controls.children[i];
      if (child.innerHTML == stateName) child.classList.add("active");else child.classList.remove("active");
    }
  };

  var moveState = function moveState(amt) {
    if (state.inTransition || !state.ready) return;
    var active = state.active;
    var index = state.stateNames.indexOf(active);
    index = Math.max(Math.min(index + amt, state.stateNames.length - 1), 1);
    transitionToState(state.stateNames[index]); // state.inTransition = true;
    // setTimeout(() => { state.inTransition = false}, settings.slideTimeout);
  };

  var initScrollStateChange = function initScrollStateChange() {
    state.inTransition = false;
    window.addEventListener("wheel", function (e) {
      if (state.active == "done" && window.scrollY > 0) return;
      if (e.deltaY > 0) moveState(1);else moveState(-1);
    });
    var touchStartY = 0;
    window.addEventListener("touchstart", function (e) {
      touchStartY = e.touches[0].clientY;
    });
    window.addEventListener("touchmove", function (e) {
      if (state.active == "done" && window.scrollY > 0) return;
      var touchMoveY = e.touches[0].clientY;
      if (touchStartY > touchMoveY + 50) moveState(1);else if (touchStartY + 50 < touchMoveY) moveState(-1);
    });
  };

  var initStateState = function initStateState() {
    state.state = {
      logoOpacity: state.materials.logo.opacity,
      bitOpacity: state.materials.bit.opacity,
      logoLightColor: new THREE.Color(0xaaaaaa),
      col1: new THREE.Color(0x888888),
      col2: new THREE.Color(0x888888),
      logoLightIntensity: state.logoLight.intensity,
      circleSize: state.circleSize,
      logoSize: state.logoSize,
      circleOpacity: state.circleOpacity,
      updateGrad: false,
      bitBack: false
    };
    updateTargetState();
  };

  var updateTargetState = function updateTargetState() {
    state.state.logoLightColor = state.state.logoLightColor.clone();
    state.state.col1 = state.state.col1.clone();
    state.state.col2 = state.state.col2.clone();
    state.target = _objectSpread({}, state.state);
    state.anims = {};
    state.defaultAnim = createAnim(TWEEN.Easing.Cubic.InOut, 1, 0);
  };

  var createAnim = function createAnim(easing, duration, delay) {
    return {
      easing: easing,
      duration: duration,
      delay: delay
    };
  };

  var adjustP = function adjustP(p, anim, defaultAnim) {
    anim = anim ? anim : defaultAnim;
    if (!anim) return p;
    if (p <= anim.delay) return 0;
    if (p >= anim.delay + anim.duration) return 1;
    return anim.easing((p - anim.delay) / anim.duration);
  };

  var transitionToState = function transitionToState(stateName) {
    // DEBUG
    // console.log(stateName);
    highlightStateDebug(stateName); // ENDDEBUG

    state.transitionDuration = 400;
    var beforeState = state.active;
    document.documentElement.classList.remove("state-" + state.active);
    state.active = stateName;
    document.documentElement.classList.add("state-" + state.active);
    if (!state.ready) return;
    updateTargetState();

    if (["state1", "state2", "state3", "done"].indexOf(stateName) < 0) {
      // opening states
      state.target.logoOpacity = 0;
      state.target.bitOpacity = 1;
      state.target.logoLightIntensity = 2;
      state.target.circleOpacity = 1;
      state.target.updateGrad = true;
      state.target.logoLightColor = new THREE.Color(0xD5D8E9);
      state.target.col1 = new THREE.Color(0x888888);
      state.target.col2 = new THREE.Color(0x888888);
      state.target.bitBack = false;

      if (beforeState == "loading") {
        state.transitionDuration = 2000;
        state.anims.circleSizeAnim = createAnim(TWEEN.Easing.Cubic.InOut, 0.7, 0.2);
        state.anims.bitOpacityAnim = createAnim(TWEEN.Easing.Cubic.InOut, 0.7, 0.3);
      } else {
        state.anims.circleOpacityAnim = createAnim(TWEEN.Easing.Cubic.InOut, 0.5, 0.33);
        state.anims.circleSizeAnim = state.anims.circleOpacityAnim;
        state.anims.logoOpacityAnim = createAnim(TWEEN.Easing.Quartic.InOut, 0.66, 0);
        state.transitionDuration = 2000;
      }
    } else {
      // later states
      state.target.logoOpacity = 1;
      state.target.bitOpacity = 1;
      state.target.circleSize = 2;
      state.target.logoSize = 1;
      state.target.logoLightIntensity = 5;
      state.target.circleOpacity = 0;
      state.target.updateGrad = false;
      state.target.bitBack = true;

      if (beforeState == "intro") {
        state.transitionDuration = 2000;
        state.anims.circleOpacityAnim = createAnim(TWEEN.Easing.Cubic.InOut, 0.5, 0);
        state.anims.circleSizeAnim = state.anims.circleOpacityAnim;
        state.anims.logoOpacityAnim = createAnim(TWEEN.Easing.Quartic.InOut, 0.66, 0.33);
      } else {
        state.defaultAnim = createAnim(TWEEN.Easing.Linear.None, 1, 0);
      }
    }

    switch (stateName) {
      case "loading":
        break;

      case "intro":
        state.target.circleSize = 1.27;
        state.target.logoSize = 1.18;
        break;

      case "state1":
        state.target.logoLightColor = new THREE.Color(0xD5D8E9);
        state.target.col1 = new THREE.Color(0xD5D8E9);
        state.target.col2 = new THREE.Color(0xA8B4D4);
        break;

      case "state2":
        state.target.logoLightColor = new THREE.Color(0xA3E637);
        state.target.col1 = new THREE.Color(0xA3E637);
        state.target.col2 = new THREE.Color(0xA8B4D7);
        break;

      case "state3":
        state.target.logoLightColor = new THREE.Color(0x05ACE0);
        state.target.col1 = new THREE.Color(0x05ACE0);
        state.target.col2 = new THREE.Color(0xA8B4D4);
        break;
    }

    startTransitionTween();
  };

  var lerp = function lerp(a, b, p) {
    return a + (b - a) * p;
  };

  var startTransitionTween = function startTransitionTween() {
    state.inTransition = true;
    console.log("start");
    var from = {
      p: 0
    };
    var to = {
      p: 1
    };
    state.transitionTween = new TWEEN.Tween(from).to(to, state.transitionDuration).easing(TWEEN.Easing.Linear.None).onStart(function () {
      if (state.target.updateGrad) state.updateGrad = true;
      if (state.target.bitBack) state.materials.bit.side = THREE.BothSides;
    }).onUpdate(function () {
      // console.log("update", this);
      var p = from.p;
      state.materials.logo.opacity = lerp(state.state.logoOpacity, state.target.logoOpacity, adjustP(p, state.anims.logoOpacityAnim, state.defaultAnim));
      state.materials.bit.opacity = lerp(state.state.bitOpacity, state.target.bitOpacity, adjustP(p, state.anims.bitOpacityAnim, state.defaultAnim));
      state.models.logo.offset = (1 - state.materials.logo.opacity) * 0.06;
      state.models.bit.offset = (1 - state.materials.bit.opacity) * 0.06;
      state.logoLight.intensity = lerp(state.state.logoLightIntensity, state.target.logoLightIntensity, adjustP(p, state.anims.logoLightIntensityAnim, state.defaultAnim));
      state.circleSize = lerp(state.state.circleSize, state.target.circleSize, adjustP(p, state.anims.circleSizeAnim, state.defaultAnim));
      state.logoSize = lerp(state.state.logoSize, state.target.logoSize, adjustP(p, state.anims.logoSizeAnim, state.defaultAnim));
      state.circleOpacity = lerp(state.state.circleOpacity, state.target.circleOpacity, adjustP(p, state.anims.circleOpacityAnim, state.defaultAnim));
      state.logoLight.color.lerpColors(state.state.logoLightColor, state.target.logoLightColor, adjustP(p, state.anims.logoLightColorAnim, state.defaultAnim));
      state.logoUniforms.col1.value.lerpColors(state.state.col1, state.target.col1, adjustP(p, state.anims.col1Anim, state.defaultAnim));
      state.logoUniforms.col2.value.lerpColors(state.state.col2, state.target.col2, adjustP(p, state.anims.col2Anim, state.defaultAnim));
    }).onComplete(function () {
      state.state = _objectSpread({}, state.target);
      if (!state.target.updateGrad) state.updateGrad = false;
      if (!state.target.bitBack) state.materials.bit.side = THREE.FrontSide;
      state.inTransition = false; // console.log("complete")
    }).start();
  }; // Ready


  var ready = function ready() {
    state.ready = true;
    initStateDebug();
    initScrollStateChange();
    initStateState(); // transitionToState("intro");

    setTimeout(function () {
      transitionToState("intro");
    }, 1000); // setTimeout(() => {transitionToState("state1");}, 2000);

    animate();
  }; // Init


  var init = function init() {
    initScene();
    initMouse();
    initModel();
    initPlanes();
    window.addEventListener("resize", resize);
    resize();
    transitionToState("loading");
    loadModel(ready);
  };

  init();
}

startHeader();

},{"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],2:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

},{}],3:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

},{}]},{},[1]);
