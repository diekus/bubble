class BubblePicture extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode:'open'});
        const bubble_wrapper = document.createElement('div');
        bubble_wrapper.setAttribute('class', 'b_wrapper');
        
        const bubble_style = document.createElement('style');
        bubble_style.textContent = `
            .b_wrapper {
                width: 100%;
                height: 100%;
                background: cornflowerblue;
            }

            #renderCanvas {
                width: 100%;
                height: 100%;
                touch-action: none;
            }
        `;

        //sets up babylonjs and the canvas to render the scene
        const renderCanvas = document.createElement('canvas');
        renderCanvas.setAttribute('id', 'renderCanvas');
        renderCanvas.setAttribute('touch-action', 'none');

        const engine = new BABYLON.Engine(renderCanvas, true);
        const scene = this.createScene();
        engine.runRenderLoop(function () {
            scene.render();
        });
        window.addEventListener('resize', function() {
            engine.resize();
        });

        //adds the elements to the shadowDom
        bubble_wrapper.appendChild(renderCanvas);
        this.shadowRoot.append(bubble_style);
        this.shadowRoot.append(bubble_wrapper);

    }

    createScene() {
        let scene = new BABYLON.Scene(this.engine);
        scene.clearColor = new BABYLON.Color3(0.09, 0.24, 0.33);
        const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI/2, Math.PI/2.5, 3, new BABYLON.Vector3(0, 0, 0));
        camera.attachControl (this.renderCanvas, true);
        this.createBubble('images/bg.jpg');
        //creates an animation for the start screen
        const frameRate = 1;
        const yRotation = new BABYLON.Animation("yRotation", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
        const keyFrames = []; 

        keyFrames.push({
            frame: 0,
            value: 1
        });

        keyFrames.push({
            frame: frameRate,
            value: 1.01
        });

        yRotation.setKeys(keyFrames);

        this.bubble.animations.push(yRotation);

        this.bub_animation = scene.beginAnimation(this.bubble, 0, 2 * frameRate, true);
        return scene;
    }

    createBubble(textureUrl) {
        if(this.bubble != null)
            this.bubble.dispose();
        this.bubble = BABYLON.MeshBuilder.CreateSphere('bubble', {'diameter': 50, 'sideOrientation': BABYLON.Mesh.BACKSIDE});
        this.bubble.scaling = new BABYLON.Vector3(1, -1, 1);
        const sphereMaterial = new BABYLON.StandardMaterial("bubble_texture", this.scene);
        sphereMaterial.diffuseColor  = new BABYLON.Color3(1, 1, 1);
        sphereMaterial.emissiveTexture = new BABYLON.Texture(textureUrl, this.scene);
        this.bubble.material = sphereMaterial;
    }

    changeImage(newImageURL) {
        try{
            this.bubble.material.emissiveTexture.dispose();
            this.bubble.material.emissiveTexture = new BABYLON.Texture(newImageURL, this.scene);
        }
        catch(e){
            console.error(e.message);
        }
    }

    pauseBubbleAnimation() {
        this.bub_animation.pause();
    }

    playBubbleAnimation() {
        this.bub_animation.restart();
    }

}

customElements.define('bubble-picture', BubblePicture);