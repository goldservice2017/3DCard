"use strict";
/*
 Config for builder
 */

function setScene( arg ){
    window.scene = arg;
}


// import MyClass from 'MyClassFolder/MyClass.js';

let threeDeepMapper = function( scene ){
    scene.deep = 0;
    let response = new function(){
        this.map = []; this.map[0] = [];
        this.stack = [];
        this.count = 0;
        this.traverseUp = function( callback ){
            for( let i = this.map.length; i > 0; i-- ){
                for(let n = this.map[i-1].length; n > 0; n--){
                    if(callback) callback( this.map[i-1][n-1] );
                }
            }
        };
    };
    let Map = response.map;
    let Stack = response.stack;
    function deep_marker_childs( obj ){
        for( let i = 0; i < obj.children.length; i++ ){
            obj.children[i].deep = obj.deep+1;
            if(!Map[ obj.children[i].deep ]) Map[ obj.children[i].deep ] = [];
            Map[ obj.children[i].deep ].push( obj.children[i] );
            Stack.push( obj.children[i] );
            deep_marker_childs( obj.children[i] );
        }
    }
    deep_marker_childs( scene );
    return response;
};

let conf = {
    invitation_wide: {
        desk:{
            _p: 1,
            cameraPositionX: 0,
            cameraZOOM: 262,
            spotLightPosition: {
                x: -0.9,
                y: -0.5,
                z: 20
            },
            obj: 'obj/invitation-landscape.obj',
            img: 'images/demo/ecard-landscape.jpg',
            type: 'wide'
        },
        mob:{
            _p: 1,
            cameraPositionX: 0.0,
            cameraZOOM: 205
        }
    },
    invitation_portrait: {
        desk:{
            _p: 2,
            cameraPositionX: 0.0,
            cameraZOOM: 285,
            spotLightPosition: {
                x: -0.9,
                y: -0.5,
                z: 20
            },
            obj: 'obj/invitation-portrait.obj',
            img: 'images/demo/ecard-portrait.jpg',
            type: 'portrait'
        },
        tablet:{
            cameraPositionX: 0.0,
            cameraZOOM: 200
        },
        mob:{
            _p: 2,
            cameraPositionX: 0.0,
            cameraZOOM: 160
        }
    },
    invitation_square: {
        desk:{
            _p: 1.5,
            cameraPositionX: 0,
            cameraZOOM: 240,
            spotLightPosition: {
                x: -0.9,
                y: -0.5,
                z: 20
            },
            obj: 'obj/invitation-square.obj',
            img: 'images/demo/invitation-square.jpg',
            type: 'square'
        },
        tablet:{
            cameraPositionX: 0.0,
            cameraZOOM: 200
        },
        mob:{
            _p: 1.5,
            cameraPositionX: 0.0,
            cameraZOOM: 180
        }
    },
    card_wide: {
        desk:{
            _p: 1.3,
            rotation: 2.8,
            spotLightPosition: {
                x: 0,
                y: 10,
                z: 100
            },
            cameraPosition:{
                x: 1.13,
                z: 35
            },
            rotationRules:{
                min: 10,
                max: 10
            },
            cameraXPos: 1,
            obj: 'obj/card.obj',
            img:{
                front: 'images/envelope_covers/landscape/landscape_front.png',
                left_inside: 'images/envelope_covers/white.png',
                right_inside: 'images/envelope_covers/landscape/landscape_inside_right.png',
                back: 'images/envelope_covers/landscape/landscape_back.png'
            },
            type: 'wide'
        },
        mob:{
            _p: 0.9,
            rotation: 1.1,
            rotationRules:{
                min: 5.5,
                max: 5.5
            },
            cameraPosition:{
                x: 0,
                z: 33
            },
            cameraXPos: -4
        }
    },
    card_portrait: {
        desk:{
            _p: 1.2,
            rotation: 5.5,
            spotLightPosition: {
                x: -50,
                y: 0,
                z: 140
            },
            cameraPosition:{
                x: 2.2,
                z: 67
            },
            rotationRules:{
                min: 4.2,
                max: -4.2
            },
            cameraXPos: 0,
            obj: 'obj/cardSquareAndPortrait.obj',
            img:{
                front: 'images/envelope_covers/portrait/portrait_front.png',
                left_inside: 'images/envelope_covers/white.png',
                right_inside: 'images/envelope_covers/portrait/portrait_inside_right.png',
                back: 'images/envelope_covers/portrait/portrait_back.png'
            },
            type: 'portrait'
        },
        mob:{
            _p: 1.4,
            rotation: 1.2,
            rotationRules:{
                min: 4.2,
                max: -4.2
            },
            cameraPosition:{
                x: 2.2,
                z: 70
            },
            cameraXPos: 6
        }
    },
    card_square: {
        desk:{
            _p: 1.5,
            rotation: 6,
            spotLightPosition: {
                x: -50,
                y: 0,
                z: 140
            },
            cameraPosition:{
                x: 5,
                z: 70
            },
            rotationRules:{
                min: 6,
                max: -6
            },
            cameraXPos: 0,
            obj: 'obj/cardSquareAndPortrait.obj',
            img:{
                front: 'images/envelope_covers/square/square_front.png',
                left_inside: 'images/envelope_covers/white.png',
                right_inside: 'images/envelope_covers/square/square_inside_right.png',
                back: 'images/envelope_covers/square/square_back.png'
            },
            type: 'square'
        },
        mob:{
            _p: 1.2,
            rotation: 1.3,
            cameraPosition:{
                x: 2.8,
                z: 50
            },
            rotationRules:{
                min: 6,
                max: -6
            },
            cameraXPos: 6
        }
    }
};
let type = $('#envelope').attr('type');


/*
init scene and 3D environment
 */
class Viewer {

    /*
    params - configs
     */
    constructor (params){

        this.params = params;
        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.time = null;
        this.down = false;
        this.mobile = false;
        this.parentWidth = document.getElementById('envelope').clientWidth;
        this.parentHeight = document.getElementById('envelope').clientHeight;
        this.streched = false;

        this.paused = false;

        this.CanvasParams = {
            width: 0,
            height: 0
        };
        
        this.cardWidth = 1024;
        this.cardHeight = 1024;
        /*
        detect mobile devices
         */
        if(window.innerWidth < 800)
            this.mobile = true;
        
        this.setBaseSize(type);
        /*if(window.innerWidth > window.innerHeight)
            this.size = (window.innerWidth / 100 * 55);
        else
            this.size = (window.innerWidth / 100 * 105);*/

        /*
        setup initial settings for card's animation
         */
        if(!this.mobile) {

            this._p = params[type].desk._p;
            if(this.params[type].desk.rotation){
                this.rotationRules = {
                    max: this.params[type].desk.rotationRules.max,
                    min: this.params[type].desk.rotationRules.min
                };

                this.rotation = this.params[type].desk.rotation;
                this.mobileXPos = this.params[type].desk.cameraXPos;
            }
        }
        else {

            this._p = params[type].mob._p;
            if(this.params[type].desk.rotation){
                this.rotationRules = {
                    max: this.params[type].mob.rotationRules.max,
                    min: this.params[type].mob.rotationRules.min
                };

                this.rotation = this.params[type].mob.rotation;
                this.mobileXPos = this.params[type].mob.cameraXPos;

            }
        }

        this.opacityGo = false;
        this.allow = false;

        /*
        run initialize function
         */
        this.init();
    }
    /*
     Get Initial Canvas Size
    */
    setBaseSize(type) {
        let w_card = 1024;
        let h_card = 1024;
        let widthRatio = 0.95;
        let maxWindowHeight = 1080.0;
        let heightMax = window.innerHeight - 225;
        if (this.mobile) {
            if (window.innerHeight < maxWindowHeight * 0.8) {
                heightMax = window.innerHeight - 150;
                this.streched = true;
            }
            let w_max = this.parentWidth ? this.parentWidth * widthRatio: window.innerWidth * widthRatio;

            if (type == 'card_portrait') {
                if (heightMax > 1.4 * w_max) {
                    w_card = w_max;
                    h_card = w_card * 1.4;
                } else {
                    h_card = heightMax;
                    w_card = w_max;
                }
                // w_card = w_max;
                // h_card = heightMax;
            } else if (type == 'card_square') {
                if (heightMax > 1.2 * w_max) {
                    w_card = w_max;
                    h_card = w_card * 1.2;
                } else {
                    w_card = w_max;
                    h_card = heightMax;
                }
                // w_card = w_max;
                // h_card = heightMax;
            } else if (type == 'card_wide') {
                if (heightMax > w_max) {
                    w_card = w_max;
                    h_card = w_card;
                } else {
                    h_card = heightMax;
                    w_card = w_max;
                }
            } else if (type == 'invitation_portrait') {
                heightMax = window.innerHeight - 150;
                if (heightMax > w_max * 1.1) {
                    w_card = w_max;
                    h_card = w_max * 1.1;
                } else {
                    w_card = w_max;
                    h_card = heightMax;
                }
            } else if (type == 'invitation_wide') {
                heightMax = window.innerHeight - 150;
                if (heightMax > w_max * 1.2) {
                    w_card = w_max;
                    h_card = w_max * 1.2;
                } else {
                    w_card = w_max;
                    h_card = heightMax;
                }
                
            } else if (type == 'invitation_square') {
                w_card = w_max;
                h_card = w_card * 1.1;
            }
            
        } else {
            if (window.innerHeight < maxWindowHeight * 0.8) {
                heightMax = window.innerHeight - 150;
                this.streched =true;   
            }
            let w_max = this.parentWidth ? this.parentWidth * widthRatio: window.innerWidth * widthRatio;
            if (type == 'card_wide') {
                if (heightMax > w_max) {
                    w_card = w_max;
                    h_card = w_card / 1.2;
                } else {
                    h_card = heightMax;
                    w_card = h_card * 1.4;
                }
            } else if(type == 'card_portrait' || type == 'card_square'){                
                if (1.6 * heightMax > w_max) {
                    w_card = w_max;
                    h_card = w_max / 1.3;
                } else {
                    h_card = heightMax;
                    w_card = h_card * 1.6;
                } 
            } else if (type == 'invitation_portrait') {
                heightMax = window.innerHeight - 150;
                if (window.innerWidth < 900) {
                    w_max = w_max * 0.9;
                }
                if (window.innerHeight < maxWindowHeight * 0.8) {
                    heightMax = window.innerHeight - 140;
                    this.streched =true;
                }
                w_card = w_max;
                h_card = heightMax;
            } else if (type == 'invitation_wide') {
                heightMax = window.innerHeight - 150;
                if (window.innerWidth < 900) {
                    w_max = w_max * 0.9;
                }
                if (window.innerHeight < maxWindowHeight * 0.8) {
                    heightMax = window.innerHeight - 140;
                    this.streched =true;
                }
                w_card = w_max;
                h_card = heightMax;
            } else if (type == 'invitation_square') {
                heightMax = window.innerHeight - 150;
                if (window.innerWidth < 900) {
                    w_max = w_max * 0.9;
                }
                if (window.innerHeight < maxWindowHeight * 0.8) {
                    heightMax = window.innerHeight - 140;
                    this.streched =true;
                }
                w_card = w_max;
                h_card = heightMax;
            }
            
                   
        }
        this.cardWidth = w_card;
        this.cardHeight = h_card;
    }
    /*
     Initialize Camera
    */
    setCameraSetting() {
        
        if(type.indexOf("invitation")>=0) {
            this.camera = new THREE.OrthographicCamera(1, 1, 1, 1, 1, 1000);

            this.camera.position.z = 10;
            this.camera.position.y = 0;

            if (!this.mobile) {
                let zoomScale = this.params[type].desk.cameraZOOM;
                if (type == 'invitation_wide') {
                    if (this.cardWidth > this.cardHeight) {
                        zoomScale = zoomScale * (this.cardHeight / 850);
                    } else {                        
                        zoomScale = zoomScale * (this.cardWidth / 850);
                    }


                } else if (type == 'invitation_portrait') {        
                    if (this.cardWidth > this.cardHeight) {
                        zoomScale = zoomScale * (this.cardHeight / 930);
                    } else {                        
                        zoomScale = zoomScale * (this.cardWidth / 968);
                    }            
                } else {
                    if (this.cardWidth > this.cardHeight) {
                        zoomScale = zoomScale * (this.cardHeight / 930);
                    } else {                        
                        zoomScale = zoomScale * (this.cardWidth / 968);
                    }                    
                }      
                this.camera.zoom = zoomScale;          
                this.camera.position.x = this.params[type].desk.cameraPositionX;

            } else {   
                let zoomScale = this.params[type].mob.cameraZOOM;
                this.camera.position.x = this.params[type].mob.cameraPositionX;
                if (type == 'invitation_wide') {
                    if (this.cardWidth > this.cardHeight) {
                        zoomScale = zoomScale * (this.cardHeight / 680);
                    } else {                        
                        zoomScale = zoomScale * (this.cardWidth / 680);
                    }
                    
                } else if (type == 'invitation_portrait') {
                    zoomScale = zoomScale * (this.cardHeight / 680);
                } else {
                    zoomScale = zoomScale * (this.cardHeight / 680);
                }
                this.camera.zoom = zoomScale; 
                // if (window.innerWidth < 640) {
                //     this.camera.zoom = this.params[type].mob.cameraZOOM * (window.innerWidth / 640);
                // }
                // this.camera.position.x = this.params[type].mob.cameraPositionX;
                // if (type == 'invitation_portrait' || type == 'invitation_square') {
                //     if (window.innerWidth < 800 && window.innerWidth > 700) {
                //         this.camera.position.x = this.params[type].tablet.cameraPositionX;
                //         this.camera.zoom = this.params[type].tablet.cameraZOOM * ;
                //     }
                // }
            }
        }else{

            let aspect = 1.0;
            let zoomScale = 1.0;

            if (this.mobile) {
                aspect = this.cardWidth / this.cardHeight; //Aspect Ratio
                if (type == 'card_square') {
                    zoomScale = 1.0;
                    if (aspect > 1.5) {
                        zoomScale = 1.1;
                    }
                    if (aspect < 0.8) {
                        zoomScale = 0.9;
                    } 
                    if (aspect < 0.65) {
                        zoomScale = 0.75;
                    }
                    if (aspect < 0.4) {
                        zoomScale = 0.6;
                    }
                } else if (type == 'card_portrait') {
                    zoomScale = 1.25;
                    if (aspect > 1.5) {
                        zoomScale = 1.4;
                    }
                    if (aspect < 0.8) {
                        zoomScale = 1.25;
                    } 
                    if (aspect < 0.65) {
                        zoomScale = 0.9;
                    }
                    if (aspect < 0.4) {
                        zoomScale = 0.6;
                    }
                } else {
                    zoomScale = 1.0;
                }
                
                this.camera = new THREE.PerspectiveCamera( 45, aspect, 1, 1000 );
                this.camera.fov *= 1 / zoomScale;
                this.camera.updateProjectionMatrix();
                
                this.camera.position.x = this.params[type].mob.cameraPosition.x;
                // if (type == 'card_square') {
                //     this.camera.position.x = this.params[type].mob.cameraPosition.x * ( this.cardWidth / (zoomScale * 1600.0));
                // } else {
                //     this.camera.position.x = this.params[type].mob.cameraPosition.x * ( this.cardWidth / (zoomScale * 1600.0));;
                // }
                this.camera.position.z = this.params[type].mob.cameraPosition.z;
                
            } else {
                aspect = this.cardWidth / this.cardHeight; //Aspect Ratio
                this.camera = new THREE.PerspectiveCamera( 45, aspect, 1, 1000 );
                if (self.streched) {
                    if (type == 'card_portrait') {
                        zoomScale = 1.35;
                    } else if (type == 'card_wide') {
                        zoomScale = 1.3;
                    } else {
                        zoomScale = 1.15;
                    }  
                } else {
                    if (type == 'card_portrait') {
                        zoomScale = 1.5;
                    } else if (type == 'card_wide') {
                        zoomScale = 1.3;
                    } else {
                        zoomScale = 1.35;
                    }  
                }
                
                this.camera.fov *= 1 / zoomScale;
                this.camera.updateProjectionMatrix();
                this.camera.position.x = 0;
                this.camera.position.z = this.params[type].desk.cameraPosition.z;
            }
        }
    }
    /*
     Initialize 3D Environment
     */
    init(){

        /*
         Initialize Camera
         */
        this.setCameraSetting();

        /*
         Initialize scene
         */
        this.scene = new THREE.Scene();
        this.scene.add(this.camera);

        setScene(this.scene);

        this.scene.destroy = () => {
            this.destroy();
        };

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        /*
         Add light on scene
         */

        let spotLight = new THREE.SpotLight( 0xffffff );

        spotLight.position.set( this.params[type].desk.spotLightPosition.x, this.params[type].desk.spotLightPosition.y, this.params[type].desk.spotLightPosition.z );
        spotLight.intensity = 0.13;

        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 256;
        spotLight.shadow.mapSize.height = 256;
        spotLight.shadow.bias = 0.000000001;
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;
        spotLight.name = 'spotlight';

        this.scene.add(spotLight);

        this.hemisphere = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0);
        this.hemisphere.name = "Hemisphere";
        this.hemisphere.position.set(0, 20, 1);
        this.hemisphere.intensity = 0.87;
        this.scene.add(this.hemisphere);

        this.spot = new THREE.SpotLight(0xfffef4, 0.3, 0, Math.PI / 2);
        this.spot.name = "Spot";
        this.spot.position.set(12, 12, 10).multiplyScalar(3);
        this.spot.target.position.set(0, 0, 0);
        this.spot.castShadow = true;
        this.spot.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(45, 1, 1, 1000));
        this.spot.shadow.bias = 0.0001;
        this.spot.shadow.mapSize.width = 1024;
        this.spot.shadow.mapSize.height = 1024;

        /*
         Render scene
         */

        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true} );
        //this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setPixelRatio( 1 );
        this.renderer.setSize(this.cardWidth, this.cardHeight);

        document.getElementById('envelope').appendChild( this.renderer.domElement );        
        // let gl = this.renderer.domElement.getContext;
        // gl.webkitImageSmoothingEnabled = false;
        // gl.mozImageSmoothingEnabled = false;
        // gl.imageSmoothingEnabled = false; //future

        this.renderer.shadowMap.enabled = false;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        /*
         Initialize Invitation/Card
         */

        if (type.indexOf("invitation")>=0)
            this.workObject = new Invitation( this.params, this );
        else
            this.workObject = new Card( this.params , this );

        /*
        init resize event
         */
        this.onWindowResize();

    }

    /*
    update camera and renderer settings on window's resize
     */
    onWindowResize(){

        this.camera.left = this.renderer.domElement.clientWidth / - 2;
        this.camera.right = this.renderer.domElement.clientWidth/ 2;
        this.camera.top = this.renderer.domElement.clientHeight / 2;
        this.camera.bottom = this.renderer.domElement.clientHeight / - 2;

        this.camera.updateProjectionMatrix();
	//If iframe - take the width of parent window
        let width = window.self !== window.top ? window.parent.innerWidth : window.innerWidth;


        this.renderer.domElement.width = width * this._p;
        this.renderer.domElement.height = width * this._p;
        //this.renderer.domElement.width  = window.innerWidth*this._p;
        //this.renderer.domElement.height = window.innerWidth*this._p;
        if(this.renderer.domElement.width > 1024)        
            this.renderer.domElement.width = 1024;

        if (type.indexOf("invitation")>=0 && !this.mobile && window.innerHeight < 800)
        {
            this.renderer.domElement.width = window.innerHeight + 100;
        }
        this.renderer.setSize(this.cardWidth, this.cardHeight );

       // $('#envelope').css('height', this.renderer.domElement.style.width);
       $('#envelope').css('height', this.cardHeight);
      
        $(this.renderer.domElement).css('margin-left', 'auto');
        $(this.renderer.domElement).css('margin-right', 'auto');
        $('#envelope').css('height', this.cardHeight);
        $('#envelope').css('display', 'grid');

    }

    parseModel(){

        this._objects = {
            model: this.scene.getObjectByName('model'),
            Plane_1: this.scene.getObjectByName('Plane 1'),
            Plane_2: this.scene.getObjectByName('Plane 2'),
            Plane_3: this.scene.getObjectByName('Plane 3'),
            Plane_4: this.scene.getObjectByName('Plane 4'),
            Plane_5: this.scene.getObjectByName('Plane 5'),
            Book: this.scene.getObjectByName('Book'),
            Plane001: this.scene.getObjectByName('Plane001'),
            Plane002: this.scene.getObjectByName('Plane002'),
            Plane003: this.scene.getObjectByName('Plane003'),
            Plane004: this.scene.getObjectByName('Plane004'),
            spotlight: this.scene.getObjectByName('spotlight')
        };

        this.presetIntroAnimation();
        this.animate();

    }

    presetIntroAnimation(){

        this.introAnimation = () => {


            if(type == 'invitation_wide') {
                if (window.innerWidth < 800) {
                    if (this._objects.model.position.y > -1.4) {
                        this._objects.model.position.y -= 0.04;
                    }
                    else {
                        if (!this.time) {
                            this.time = Date.now() + 800;
                            return;
                        }
                        else if (this.time > Date.now())
                            return;
                        if (this._objects.Plane_2.position.y < 1.25 && this.down == false) {
                            this._objects.Plane_2.position.y += 0.04;
                            this._objects.Plane_4.position.y -= 0.02;
                            this._objects.Plane_5.position.y -= 0.02;
                        }
                        else {
                            this.down = true;
                        }
                        if (this.down && this._objects.Plane_2.position.y > 0.2) {
                            this._objects.Plane_2.position.y -= 0.04;
                            this._objects.Plane_4.position.y += 0.02;
                            this._objects.Plane_5.position.y += 0.02;
                            this._objects.Plane_4.position.z = 0;
                            setTimeout(() => {
                                this.opacityGo = true;
                                this.animationComplete();
                            }, 1000);

                        }
                    }
                    if (window.innerWidth < 800 && this.opacityGo) {
                        if (this._objects.Plane_4.material.opacity <= 1 && this._objects.Plane_4.material.opacity > 0) {
                            this._objects.Plane_4.material.opacity -= 0.07;
                            this._objects.Plane_5.material.opacity -= 0.07;
                            this._objects.Plane_2.scale.x += 0.015;
                            this._objects.Plane_2.scale.y += 0.015;
                        }
                    }
                }
                else {
                    if (this._objects.model.position.y > -1.5) {
                        this._objects.model.position.y -= 0.03;
                    }
                    else {
                        if (!this.time) {
                            this.time = Date.now() + 800;
                            return;
                        }
                        else if (this.time > Date.now())
                            return;
                        if (this._objects.Plane_2.position.y < 0.7 && this.down == false) {
                            this._objects.Plane_2.position.y += 0.03;
                            this._objects.Plane_4.position.y -= 0.06;
                            this._objects.Plane_5.position.y -= 0.06;
                        }
                        else {
                            this.down = true;
                        }
                        if (this.down && this._objects.Plane_2.position.y > 0.26) {
                            this._objects.Plane_2.position.y -= 0.02;
                            this._objects.Plane_4.position.x -= 0.0105;
                            this._objects.Plane_5.position.x -= 0.0105;

                            this._objects.Plane_4.position.y += 0.045;
                            this._objects.Plane_5.position.y += 0.045;
                            this._objects.Plane_4.position.z = 0;
                            setTimeout(() => {
                                this.opacityGo = true;
                                this.animationComplete();
                            }, 1000);

                        }
                    }

                }
            }
            else if (type == 'invitation_portrait') {
                if(window.innerWidth > 800) {
                    if (this._objects.model.position.y > -1.6)
                        this._objects.model.position.y -= 0.03;
                    else {
                        if (!this.time) {
                            this.time = Date.now() + 1000;
                            return false;
                        }
                        else if (this.time > Date.now())
                            return false;
                        if (this._objects.Plane_2.position.y < 0.8 && this.down == false) {
                            this._objects.Plane_2.position.y += 0.02;
                            this._objects.Plane_4.position.y -= 0.04;
                            this._objects.Plane_5.position.y -= 0.04;
                        }
                        else {
                            this.down = true;
                        }
                        if (this.down && this._objects.Plane_2.position.y > 0.3) {
                            this._objects.Plane_2.position.y -= 0.02;
                            this._objects.Plane_4.position.y += 0.04;
                            this._objects.Plane_5.position.y += 0.04;
                            this._objects.Plane_4.position.z = 0;
                            setTimeout(() => {
                                this.opacityGo = true;
                                this.animationComplete();
                            }, 1200);

                        }
                    }

                }
                else{
                    if (this._objects.model.position.y > -1.6)
                        this._objects.model.position.y -= 0.04;
                    else {
                        if (!this.time) {
                            this.time = Date.now() + 800;
                            return;
                        }
                        else if (this.time > Date.now())
                            return;
                        if (this._objects.Plane_2.position.y < 0.8 && this.down == false) {
                            this._objects.Plane_2.position.y += 0.025;
                            this._objects.Plane_4.position.y -= 0.04;
                            this._objects.Plane_5.position.y -= 0.04;
                        }
                        else {
                            this.down = true;
                        }
                        if (this.down && this._objects.Plane_2.position.y > 0.2) {
                            this._objects.Plane_2.position.y -= 0.025;
                            this._objects.Plane_4.position.y += 0.04;
                            this._objects.Plane_5.position.y += 0.04;
                            this._objects.Plane_4.position.z = 0;
                            setTimeout(()=>{
                                this.opacityGo = true;
                                this.animationComplete();
                            }, 1200);

                        }
                    }
                    if (this.mobile && this.opacityGo) {
                        if (this._objects.Plane_4.material.opacity <= 1 && this._objects.Plane_4.material.opacity > 0) {
                            this._objects.Plane_4.material.opacity -= 0.07;
                            this._objects.Plane_5.material.opacity -= 0.07;
                            this._objects.Plane_2.scale.x += 0.022;
                            this._objects.Plane_2.scale.y += 0.022;
                            this._objects.Plane_2.position.y -= 0.02;

                        }
                    }
                }
            }
            else if (type == 'invitation_square') {
                if(window.innerWidth < 800) {
                    if (this._objects.model.position.y > -1.8)
                        this._objects.model.position.y -= 0.04;
                    else {
                        if (!this.time) {
                            this.time = Date.now() + 400;
                            return;
                        }
                        else if (this.time > Date.now())
                            return;
                        if (this._objects.Plane_2.position.y < 1.35 && this.down == false) {
                            this._objects.Plane_2.position.y += 0.03;
                            this._objects.Plane_4.position.y -= 0.015;
                            this._objects.Plane_5.position.y -= 0.015;
                        }
                        else {
                            this.down = true;
                        }
                        if (this.down && this._objects.Plane_2.position.y > 0.24) {
                            this._objects.Plane_2.position.y -= 0.03;
                            this._objects.Plane_4.position.y += 0.015;
                            this._objects.Plane_5.position.y += 0.015;
                            this._objects.Plane_4.position.z = -0.1;
                            setTimeout(()=>{
                                this.opacityGo = true;
                                this.animationComplete();
                            }, 1200);
                        }
                    }
                    if (window.innerWidth < 800 && this.opacityGo) {
                        if (this._objects.Plane_4.material.opacity <= 1 && this._objects.Plane_4.material.opacity > 0) {
                            this._objects.Plane_4.material.opacity -= 0.07;
                            this._objects.Plane_5.material.opacity -= 0.07;
                            this._objects.Plane_2.scale.x += 0.022;
                            this._objects.Plane_2.scale.y += 0.022;
                        }
                    }
                }
                else{
                    if(this._objects.model.position.y > -1.8)
                        this._objects.model.position.y -= 0.035;
                    else {
                        if(!this.time){
                            this.time = Date.now() + 800;
                            return;
                        }
                        else if(this.time > Date.now())
                            return;
                        if(this._objects.Plane_2.position.y < 1.05 && this.down == false) {
                            this._objects.Plane_2.position.y += 0.025;
                            this._objects.Plane_4.position.y -= 0.035;
                            this._objects.Plane_5.position.y -= 0.035;
                        }
                        else{
                            this.down = true;
                        }
                        if(this.down && this._objects.Plane_5.position.y < 0.05){
                            this._objects.Plane_2.position.y -= 0.02;

                            this._objects.Plane_4.position.x -= 0.01;
                            this._objects.Plane_5.position.x -= 0.01;

                            this._objects.Plane_4.position.y += 0.04;
                            this._objects.Plane_5.position.y += 0.04;
                            this._objects.Plane_4.position.z = -0.2;
                            setTimeout(()=>{
                                this.opacityGo = true;
                                this.animationComplete();
                            }, 1000);
                        }
                    }

                }
            }

            if(type == 'card_square'){
                if(!this.mobile) {
                    if (this._objects.model.position.y > -3.8) {
                        this._objects.model.position.y -= 0.5;
                        this._objects.Book.position.y -= 0.5;
                    }
                    else {
                        if (!this.time) {
                            this.time = Date.now() + 1000;
                            return;
                        }
                        else if (this.time > Date.now())
                            return;
                        if (this._objects.Plane002.position.y < 19 && this.down == false) {
                            this._objects.Plane002.position.y += 0.3;
                            this._objects.Plane003.position.y += 0.3;
                            this._objects.Plane001.position.y += 0.3;
                            this._objects.Plane004.position.y += 0.3;

                            this._objects.Plane_1.position.x -= 0.5;
                            this._objects.Plane_2.position.x -= 0.5;
                        }
                        else {
                            this.down = true;
                        }
                        if (this.down && this._objects.Plane002.position.y > 9.45) {
                            this._objects.Plane002.position.y -= 0.3;
                            this._objects.Plane003.position.y -= 0.3;
                            this._objects.Plane001.position.y -= 0.3;
                            this._objects.Plane004.position.y -= 0.3;

                            this._objects.Plane_1.position.x += 0.45;
                            this._objects.Plane_2.position.x += 0.45;
                            this._objects.Plane_1.position.y += 0.14;
                            this._objects.Plane_2.position.y += 0.14;
                            this._objects.Plane_2.position.z = -5;

                            this.allow = true;
                            setTimeout(()=>{
                                this.opacityGo = true;
                                this.animationComplete();
                            }, 1200);
                        }
                    }

                    if(this._objects.Book.rotation.y < 0.1) {
                        this._objects.spotlight.position.set(20, 0, 130);
                    }
                    else {
                        this._objects.spotlight.position.set(-20, 0, 130);
                    }

                }else{
                    if (this._objects.model.position.y > -5.2) {
                        this._objects.model.position.y -= 0.4;
                        this._objects.Book.position.y -= 0.4;
                    }
                    else {
                        if (!this.time) {
                            this.time = Date.now() + 1000;
                            return;
                        }
                        else if (this.time > Date.now())
                            return;
                        if (this._objects.Plane002.position.y < 15 && this.down == false) {
                            this._objects.Plane002.position.y += 0.2;
                            this._objects.Plane003.position.y += 0.2;
                            this._objects.Plane001.position.y += 0.2;
                            this._objects.Plane004.position.y += 0.2;
                            this._objects.Plane_1.position.x -= 0.6;
                            this._objects.Plane_2.position.x -= 0.6;
                        }
                        else {
                            this.down = true;
                        }
                        if (this.down && this._objects.Plane002.position.y > 9) {
                            this._objects.Plane002.position.y -= 0.2;
                            this._objects.Plane003.position.y -= 0.2;
                            this._objects.Plane001.position.y -= 0.2;
                            this._objects.Plane004.position.y -= 0.2;

                            this._objects.Plane_1.position.x += 0.6;
                            this._objects.Plane_2.position.x += 0.6;
                            this._objects.Plane_2.position.z -= 0.2;


                            setTimeout(()=>{
                                this.opacityGo = true;
                                this.allow = true;
                            }, 1200);
                        }
                    }
                    if (this.mobile && this.opacityGo) {
                        if (this._objects.Plane_1.material.opacity <= 1 && this._objects.Plane_1.material.opacity > -0.1) {
                            this._objects.Plane_1.material.opacity -= 0.085;
                            this._objects.Plane_2.material.opacity -= 0.085;
                            this._objects.Plane001.scale.x += 0.032;
                            this._objects.Plane001.scale.y += 0.04;
                            this._objects.Plane002.scale.x += 0.032;
                            this._objects.Plane002.scale.y += 0.04;
                            this._objects.Plane003.scale.x += 0.032;
                            this._objects.Plane003.scale.y += 0.04;
                            this._objects.Plane004.scale.x += 0.032;
                            this._objects.Plane004.scale.y += 0.04;


                            this._objects.Book.position.y += 0.40;
                            this.camera.position.z += 0.7;
                            //this._objects.Plane_2.position.z = -5;
                            this.camera.position.x += 0.28;
                            this.animationComplete();
                            // $('.dragMob').show();
                        }
                        if (this._objects.Plane_1.material.opacity < 0.1) {
                            this._objects.Plane_1.position.z = -3;
                        }
                    }

                    if(this._objects.Book.rotation.y < 0.1) {
                        this._objects.spotlight.position.set(40, 0, 130);
                    }
                    else {
                        this._objects.spotlight.position.set(-20, 0, 130);
                    }
                }



            }else if(type == 'card_portrait'){
                if(this.mobile) {
                    if (this._objects.model.position.y > -9.3) {
                        this._objects.model.position.y -= 0.3;
                        this._objects.Book.position.y -= 0.3;
                    }
                    else {
                        if (!this.time) {
                            this.time = Date.now() + 850;
                            return;
                        }
                        else if (this.time > Date.now())
                            return;
                        if (this._objects.Plane002.position.y < 17 && this.down == false) {
                            this._objects.Plane002.position.y += 0.35;
                            this._objects.Plane003.position.y += 0.35;
                            this._objects.Plane001.position.y += 0.35;
                            this._objects.Plane004.position.y += 0.35;
                            this._objects.Plane_1.position.x -= 0.55;
                            this._objects.Plane_2.position.x -= 0.55;
                        }
                        else {
                            this.down = true;
                        }
                        if (this.down && this._objects.Plane002.position.y > 8.5) {
                            this._objects.Plane002.position.y -= 0.35;
                            this._objects.Plane003.position.y -= 0.35;
                            this._objects.Plane001.position.y -= 0.35;
                            this._objects.Plane004.position.y -= 0.35;

                            this._objects.Plane_1.position.x += 0.55;
                            this._objects.Plane_2.position.x += 0.55;
                            this._objects.Plane_2.position.z = 0;
                            this._objects.Plane_1.position.z = -0.1;
                            this.allow = true;

                            setTimeout(() => {
                                this.opacityGo = true;
                            }, 1200);
                        }
                    }
                    if (window.innerWidth < 800 && this.opacityGo) {
                        if (this._objects.Plane_1.material.opacity <= 1 && this._objects.Plane_1.material.opacity > -0.1) {
                            this._objects.Plane_1.material.opacity -= 0.085;
                            this._objects.Plane_2.material.opacity -= 0.085;
                            this._objects.Plane001.scale.x += 0.02;
                            this._objects.Plane001.scale.y += 0.025;
                            this._objects.Plane002.scale.x += 0.02;
                            this._objects.Plane002.scale.y += 0.025;
                            this._objects.Plane003.scale.x += 0.02;
                            this._objects.Plane003.scale.y += 0.025;
                            this._objects.Plane004.scale.x += 0.02;
                            this._objects.Plane004.scale.y += 0.025;

                            this.camera.position.z += 0;

                            this.animationComplete();
                            // $('.dragMob').show();
                            //this._objects.Plane_2.position.z = -5;
                            this.camera.position.x += 0.15;
                            this.camera.position.y += 0.12;
                        }
                        if (this._objects.Plane_1.material.opacity < 0.1) {
                            this._objects.Plane_1.position.z = -3;
                        }
                    }
                    // if(this._objects.Book.rotation.y < 0.1) {
                    //     this._objects.spotlight.position.set(10, 0, 80);
                    //     this._objects.Plane_2.receiveShadow = true;
                    // }
                    // else
                    //     this._objects.spotlight.position.set(-50, 0, 180 );

                    if(this._objects.Book.rotation.y < 0.1) {
                        this._objects.spotlight.position.set(80, 0, 200);
                    }
                    else {
                        this._objects.spotlight.position.set(-30, 0, 200);
                    }
                }
                else{
                    if (this._objects.model.position.y > -10.2) {
                        this._objects.model.position.y -= 0.35;
                        this._objects.Book.position.y -= 0.35;
                    }
                    else {
                        if (!this.time) {
                            this.time = Date.now() + 1050;
                            return;
                        }
                        else if (this.time > Date.now())
                            return;
                        if (this._objects.Plane002.position.y < 15 && this.down == false) {
                            this._objects.Plane002.position.y += 0.3;
                            this._objects.Plane003.position.y += 0.3;
                            this._objects.Plane001.position.y += 0.3;
                            this._objects.Plane004.position.y += 0.3;
                            this._objects.Plane_1.position.x -= 0.5;
                            this._objects.Plane_2.position.x -= 0.5;
                        }
                        else {
                            this.down = true;
                        }
                        if (this.down && this._objects.Plane002.position.y > 9) {
                            this._objects.Plane002.position.y -= 0.3;
                            this._objects.Plane003.position.y -= 0.3;
                            this._objects.Plane001.position.y -= 0.3;
                            this._objects.Plane004.position.y -= 0.3;

                            this._objects.Plane_1.position.x += 0.5;
                            this._objects.Plane_2.position.x += 0.5;
                            this._objects.Plane_2.position.z -= 0.5;
                            this._objects.Plane_1.position.z = -0.1;


                            setTimeout(() => {
                                this.opacityGo = true;
                                this.allow = true;
                                this.animationComplete();
                            }, 1200);
                        }


                    }

                    if(this._objects.Book.rotation.y < 0.1) {
                        this._objects.spotlight.position.set(20, 0, 130);
                    }
                    else {
                        this._objects.spotlight.position.set(-20, 0, 130);
                    }

                }
            } else if(type == 'card_wide'){
                if(!this.mobile) {
                    if (this._objects.model.position.y > -0.5) {
                        this._objects.model.position.y -= 0.35;
                        this._objects.Book.position.y -= 0.35;
                    }
                    else {
                        if (!this.time) {
                            this.time = Date.now() + 950;
                            return;
                        }
                        else if (this.time > Date.now())
                            return;
                        if (this._objects.Plane002.position.y > -6.5 && !this.down) {
                            this._objects.Plane002.position.y -= 0.3;
                            this._objects.Plane003.position.y -= 0.3;
                            this._objects.Plane001.position.y -= 0.3;
                            this._objects.Plane004.position.y -= 0.3;
                            this._objects.Plane_1.position.y -= 0.5;
                            this._objects.Plane_2.position.y -= 0.5;
                        }
                        else {
                            this.down = true;
                        }
                        if (this.down && this._objects.Plane002.position.y < -1.0) {
                            this._objects.Plane002.position.y += 0.3;
                            this._objects.Plane003.position.y += 0.3;
                            this._objects.Plane001.position.y += 0.3;
                            this._objects.Plane004.position.y += 0.3;
                            // this._objects.Book.position.y += 0.3;
                            // this._objects.Book.position.z = 0.5;         
                            this._objects.Plane_1.position.y += 0.6;
                            this._objects.Plane_2.position.y += 0.6;

                            this._objects.Plane_1.position.x -= 0.22;
                            this._objects.Plane_2.position.x -= 0.22;

                            this._objects.Plane_1.position.z -= 0.3;
                            // this._objects.Plane_2.position.z = -5;
                            this._objects.Plane_2.position.z -= 0.5;
                            this.allow = true;
                            setTimeout(() => {
                                this.opacityGo = true;
                                // this._objects.Book.position.y = 1.5;
                                // this._objects.Book.position.z = 0.5;
                                this.animationComplete();
                            }, 1200);
                        }
                    }
                    if (this._objects.Book.rotation.x < 0.1) {
                        this._objects.spotlight.position.set(0, -10, 100);
                        this._objects.spotlight.intensity = 0.25;
                    }
                    else {
                        this._objects.spotlight.position.set(0, 10, 100);
                        this._objects.spotlight.intensity = 0.25;
                    }

                }
                else{
                    if (this._objects.model.position.y > 0) {
                        this._objects.model.position.y -= 0.4;
                        this._objects.Book.position.y -= 0.4;
                    }
                    else {
                        if (!this.time) {
                            this.time = Date.now() + 950;
                            return;
                        }
                        else if (this.time > Date.now())
                            return;
                        if (this._objects.Plane002.position.y > -4.5 && !this.down) {
                            this._objects.Plane002.position.y -= 0.2;
                            this._objects.Plane003.position.y -= 0.2;
                            this._objects.Plane001.position.y -= 0.2;
                            this._objects.Plane004.position.y -= 0.2;
                            this._objects.Plane_1.position.y -= 0.63;
                            this._objects.Plane_2.position.y -= 0.65;
                        }
                        else {
                            this.down = true;
                        }
                        if (this.down && this._objects.Plane002.position.y < -0.5) {
                            this._objects.Plane002.position.y += 0.2;
                            this._objects.Plane003.position.y += 0.2;
                            this._objects.Plane001.position.y += 0.2;
                            this._objects.Plane004.position.y += 0.2;

                            this._objects.Plane_1.position.y += 0.63;
                            this._objects.Plane_2.position.y += 0.63;
                            this._objects.Plane_1.position.z -= 0.3;
                            this._objects.Plane_2.position.z = -5;
                            this.allow = true;
                            setTimeout( () => {
                                this.opacityGo = true;
                            }, 1200);
                        }
                    }
                    if (window.innerWidth < 800 && this.opacityGo) {
                        if (this._objects.Plane_1.material.opacity <= 1 && this._objects.Plane_1.material.opacity > -0.1) {
                            this._objects.Plane_1.material.opacity -= 0.08;
                            this._objects.Plane_2.material.opacity -= 0.08;
                            this._objects.Plane001.scale.x += 0.03;
                            this._objects.Plane001.scale.y += 0.035;
                            this._objects.Plane002.scale.x += 0.03;
                            this._objects.Plane002.scale.y += 0.035;
                            this._objects.Plane003.scale.x += 0.03;
                            this._objects.Plane003.scale.y += 0.035;
                            this._objects.Plane004.scale.x += 0.03;
                            this._objects.Plane004.scale.y += 0.035;


                            this.animationComplete();
                            // $('.dragMob').show();

                        }
                        if (this._objects.Plane_1.material.opacity < 0.1) {
                            this._objects.Plane_1.position.z = -3;
                        }
                    }

                    if(this._objects.Book.rotation.x < 0.1){
                        this._objects.spotlight.position.set(0, -10, 100);
                        this._objects.spotlight.intensity = 0.25;
                    }
                    else {
                        this._objects.spotlight.position.set(0, 10, 100);
                        this._objects.spotlight.intensity = 0.25;
                    }

                }
            }

            this.animationComplete = () =>
            {
                
                $("._3dhide").removeClass("_3dhide");
            }

        };
    }


    /*
     Animation of Invitation/Cards
     */

    clearAnimate(){
        this.animate = function(){};
    }

    animate(){

        requestAnimationFrame( () => {
            this.animate();
        });

        if( this.paused ){
            return false;
        }

        this.render();

        /*
        animation of appearing and moving a card outside the envelop
         */
        if( this.introAnimation ) this.introAnimation();

    }

    clearScene( callback ){
        let SceneMap = threeDeepMapper( this.scene );
        if( SceneMap.stack.length > 0 ){
            SceneMap.traverseUp(function( child ){
                if( 'material' in child) {
                    if('map' in child.material && child.material.map ) child.material.map.dispose();
                    child.material.dispose && child.material.dispose();
                }
                if('geometry' in child) child.geometry.dispose();
                child.parent.remove( child );
            });
            if( this.scene.children.length > 0 ){
                this.clearScene( callback );
            } else {
                callback();
            }
        }

    }

    destroy(){

        // stop animation
        this.clearAnimate();

        // clear Scene

        this.clearScene( ()=> {
            // remove

            console.log('scene was cleared');

            this.camera = null;
            this.scene = null;
            this.time = null;
            this.down = false;
            this.mobile = false;
            this.workObject.destroy();
            this.workObject = null;
            $( this.renderer.domElement ).remove();
            this.renderer = null;
            // window.myApp  = false;
        });


    }

    /*
     Rendering
     */
    render(){
        this.renderer.render(this.scene, this.camera);
    }

}

/*
Invitation card's class
 */
class Invitation {
    /*
    params - configs
    viewer - Viewer's class instance
     */
    constructor (params, viewer){

        this.initClass = viewer;

        this.type = 'Invitation';

        this.initInvitation(params[type]);

    }

    initInvitation(type){

        let self = this;

        //  CONFIG for loading textures

        let CONFIG = {
            sides: [{
                name: 'texture_envelope',
                texture: 'images/envelopes/envelope_back.png'
            }, {
                name: 'texture_down',
                texture: 'images/envelopes/envelope_front.png'
            }, {
                name: 'texture_page',
                texture: type.desk.img
            }]

        };

        let initTexture = [];

        function initSide( nextSide ){
            var manager = new THREE.LoadingManager();
            self[nextSide.name] = new THREE.Texture();
            self[nextSide.name].magFilter = THREE.NearestFilter;
            self[nextSide.name].minFilter = THREE.LinearFilter;
            var loader = new THREE.ImageLoader( manager );
            self[nextSide.name].image = loader.load( nextSide.texture );
            self[nextSide.name].needsUpdate = true;

            manager.onLoad = () => {
                initTexture.push(true);
            };

        }

        for( let i = 0; i < CONFIG.sides.length; i++ ){

            initSide( CONFIG.sides[i] );

        }


        /*
          Loader for the model and set up textures and positions
         */

        this.destroy = function(){
            let toDispose = [
                texture_envelope,
                texture_down,
                texture_page
            ];
            for( let i = 0; i < toDispose.length; i++ ){
                if( toDispose[i] && toDispose[i].image ) toDispose[i].image = null;
                if( toDispose[i] && toDispose[i].dispose ) toDispose[i].dispose();
            }
        };

        let loaderObj = new THREE.OBJLoader();

        loaderObj.load( type.desk.obj , ( object )=>{

            /*
            setup initial settings for each type of card:
            - wide
            - portrait
            - square

        */
            if(type.desk.type == 'wide') {
                /*
                 Traverse works like a forEach for Three.js
                 */
                object.traverse((child) => {

                    if (child instanceof THREE.Mesh) {

                        child.material.transparent = true;

                        if (child.name == 'Plane 5') {
                            child.material.map = self.texture_envelope;
                            child.receiveShadow = true;
                        }

                        if (child.name == 'Plane 2') {

                            child.material.map = self.texture_page;
                            child.position.y = 0.15;
                            child.position.x = -0.01;

                            child.material.map.wrapS = 1002;
                            child.material.map.wrapT = 1002;
                            child.material.map.offset.x = 1;

                            child.scale.y = 0.85;
                            child.scale.x = 0.95;

                            child.castShadow = true;
                            child.material.side = 2;
                            child.position.z = 1;
                            child.rotation.y = 3.14;

                            child.material.color.r = 0.9;
                            child.material.color.g = 0.92;
                            child.material.color.b = 0.92;

                        }

                        if (child.name == 'Plane 4') {

                            child.material.map = self.texture_down;
                            child.position.z = 1.5;
                            child.receiveShadow = true;

                        }

                        if (child.name == 'Plane 1') {


                            child.visible = false;
                            child.position.z = -0.2;
                            child.receiveShadow = true;

                        }

                    }
                });

                object.name = 'model';

                //if (window.innerWidth > 800)
                //    $('#btn').css('margin-top', -75);
                //else {
                //    $('#btn').css('margin-top', -140);
                //    object.position.y = 1;
                //}

                if (window.innerWidth < 800)
                    object.position.y = 1;


            }
            else if(type.desk.type == 'portrait'){
                /*
                 Traverse works like a forEach for Three.js
                 */
                object.traverse( ( child )=> {
                    if ( child instanceof THREE.Mesh ) {

                        child.material.transparent = true;
                        if(child.name == 'Plane 5'){
                            child.material.map = self.texture_envelope;
                            child.receiveShadow = true;
                        }
                        if(child.name == 'Plane 1'){

                            child.position.z = -0.2;
                            child.receiveShadow = true;
                            child.visible = false;
                        }

                        if(child.name == 'Plane 2'){
                            child.material.map = self.texture_page;
                            child.position.y = 0.27;
                            child.scale.x = 1.15;
                            child.scale.y = 1.15;
                            child.castShadow = true;
                            child.material.side = 2;
                            child.position.z = 1;
                            child.rotation.y = 3.14;

                            child.material.map.wrapS = 1002;
                            child.material.map.wrapT = 1002;
                            child.material.map.offset.x = 1;

                            child.material.color.r = 0.9;
                            child.material.color.g = 0.92;
                            child.material.color.b = 0.92;

                        }
                        if(child.name == 'Plane 4') {
                            child.material.map = self.texture_down;
                            child.position.z = 1.2;
                            child.receiveShadow = true;
                        }

                    }
                } );

                object.name = 'model';

             /*   if(window.innerWidth>800)
                    $('#btn').css('margin-top', -170);
                else{
                    $('#btn').css('margin-top', -330);
                }*/


                if(this.initClass.mobile)
                    object.position.y = 1.6;

            }
            else if(type.desk.type == 'square'){
                /*
                 Traverse works like a forEach for Three.js
                 */
                object.traverse( ( child ) => {
                    if ( child instanceof THREE.Mesh ) {

                        child.material.transparent = true;
                        if(child.name == 'Plane 5'){
                            child.material.map = self.texture_envelope;
                            child.scale.x = 0.86;
                            child.scale.y = 1.2;
                            child.receiveShadow = true;
                        }

                        if(child.name == 'Plane 1'){

                            child.position.z = -0.2;
                            child.receiveShadow = true;

                            child.visible = false;
                        }

                        if(child.name == 'Plane 2'){
                            child.material.map = self.texture_page;
                            child.position.y = 0.2;
                            child.scale.x = 0.7;
                            child.scale.y = 0.7;
                            child.castShadow = true;
                            child.material.side = 2;
                            child.position.z = 1;
                            child.rotation.y = 3.14;

                            child.material.map.wrapS = 1002;
                            child.material.map.wrapT = 1002;
                            child.material.map.offset.x = 1;

                            child.material.color.r = 0.9;
                            child.material.color.g = 0.92;
                            child.material.color.b = 0.92;
                        }
                        if(child.name == 'Plane 4') {
                            child.material.map = self.texture_down;
                            child.position.z = 1.3;
                            child.scale.x = 0.86;
                            child.scale.y = 1.2;
                            child.receiveShadow = true;
                        }

                    }
                } );
                object.name = 'model';


            }


            this.time = Date.now() + 4000;




            let _interv = setInterval(() => {
                if(initTexture.length === 3 && this.time <  Date.now() ){
                    clearInterval(_interv);
                    setTimeout(()=>{
                        $('#magic').hide();
                        this.initClass.parseModel();
                    }, 500);
                }
            }, 400);

            /*
              Add invitation cards on scene
             */
            this.initClass.scene.add( object );
        });
    }

}

/*
regular card's class
 */
class Card {

    constructor ( params, viewer ){
        this.initClass = viewer;

        this.type = 'Card';

        if(type == 'card_wide')
         this.correctMoveWide = 8.4;
        else
         this.correctMoveWide = 0;

        this.initCard(params[type]);

    }

    initCard(type){

        let self = this;

        /*
         An object with settings and events for card's animation
         */
        let Book = {
            rotation: 1,
            inAction: false,
            stopAnimation: function(){},
            animationFrames: 50,

            /*
            endRotation - (0 - 1)
            0 - opened card
            1 - closed card

            startR - (0 - 1)
            value of a card's state
            ex: 0.5 - semi-closed
             */

            animator: function(  endRotation, startR ) {
                Book.inAction = true;
                let startRotation = startR || Book.rotation;
                let framesForEnd = Book.animationFrames;
                let framesLeft = framesForEnd;
                let animation = setInterval( function() {
                    framesLeft--;
                    let alp = (framesLeft/framesForEnd );

                    let crossSin = 1 - Math.sin( (alp * Math.PI/2) + Math.PI/2 );

                    Book.rotation = endRotation + (startRotation - endRotation) * crossSin;
                    Book.applyParams( );
                    if( framesLeft === 0 ){
                        Book.stopAnimation();
                        return;
                    }
                }, 20 );
                let that = this;
                this.stopAnimation = function(){
                    that.inAction = false;
                    clearInterval( animation );
                    //   this.stopAnimation = () => {};
                }

            },

            /*
            define with which page we are currently working on
             */
            clickRotator: function() {
                if( this.inAction ){
                    return;
                }
                if( this.rotation < this.states.b.max ){
                    if( this.rotation >= this.states.b.min ){
                        this.animator( this.states.c.max );
                    } else {
                        this.animator( this.states.b.min );
                    }
                } else {
                    if( this.rotation <= this.states.c.max ){
                        this.animator( this.states.b.min );
                    } else {
                        this.animator( this.states.d.min );
                    }
                }

            },

            /*
            a - first page rotate
            b - both pages rotate when card is open
            c - second page rotate
            d - both page rotate when card is closed
             */
            states: {
                a: {
                    min: 0,
                    max: 0.3
                },
                b: {
                    min: 0.3,
                    max: 0.5
                },
                c: {
                    min: 0.5,
                    max: 0.7
                },
                d: {
                    min: 0.7,
                    max: 1
                }
            },

            /*
             b_mm_Xpos - position of a card on the scene
             b_mm - rotation of cards
             p1_mm - rotation of fist page at the moment of full opening
             p2_mm - rotation of secong page at the moment of full opening
             */
            rotationRules: {
                b_mm_Xpos: {
                    min: self.initClass.rotationRules.min + (self.initClass.mobileXPos || 0),
                    max: self.initClass.rotationRules.max - self.correctMoveWide
                },
                b_mm: {
                    min: 0,
                    max: Math.PI*0.4
                },
                p1_mm: {
                    min: 0,
                    max: Math.PI*0.6
                },
                p2_mm: {
                    min: 0,
                    max: Math.PI*0.6
                }
            },

            /*
            get a state of the card from the last click
             */
            getRotations: function(){

                let BookRotation = 0, BookXPos = 0;

                let b_mm = this.rotationRules.b_mm;
                let b_mm_Xpos = this.rotationRules.b_mm_Xpos;

                if( this.rotation < this.states.b.min ){
                    BookRotation = b_mm.min;
                    BookXPos = b_mm_Xpos.min;

                } else if ( this.rotation > this.states.c.max ){
                    BookRotation = b_mm.max;
                    BookXPos = b_mm_Xpos.max;

                } else {
                    BookRotation = (( b_mm.min + (b_mm.max - b_mm.min) * ( (this.rotation - this.states.b.min) / ( this.states.c.max - this.states.b.min ) ) )  );

                    BookXPos = (( b_mm_Xpos.min + (b_mm_Xpos.max - b_mm_Xpos.min) * ( (this.rotation - this.states.b.min) / ( this.states.c.max - this.states.b.min ) ) )  )

                }

                let p1R = 0;
                let p1_mm = this.rotationRules.p1_mm;
                if ( this.rotation > this.states.a.max ){
                    p1R = p1_mm.max;
                } else {
                    p1R = (( p1_mm.min + (p1_mm.max - p1_mm.min) * ( (this.rotation - this.states.a.min) / ( this.states.a.max - this.states.a.min ) ) )  )
                }

                let p2R = 0;
                let p2_mm = this.rotationRules.p2_mm;
                if ( this.rotation < this.states.d.min ){
                    p2R = p2_mm.min;
                } else {
                    p2R = (( p2_mm.min + (p2_mm.max - p2_mm.min) * ( (this.rotation - this.states.d.min) / ( this.states.d.max - this.states.d.min ) ) )  )
                }
                let result = {
                    bookR: BookRotation,
                    bookX: BookXPos,
                    page1: p1R,
                    page2: p2R
                };


                return result;
            },

            /*
            setup params on each card's move
             */
            applyParams: function(){

                let params = this.getRotations();

                if(type.desk.type == 'wide'){
                    BookObj.rotation.set( params.bookR, 0, 0 );
                    if (window.innerWidth < 800) {
                        BookObj.position.y = params.bookX;
                        Page1Obj.rotation.set( params.page1, 0, 0 );
                        Page2Obj.rotation.set( params.page2, 0, 0 );
                    } else {
                        BookObj.position.y = params.bookX - 5.95;
                        Page1Obj.rotation.set( params.page1, 0, 0 );
                        Page2Obj.rotation.set( params.page2, 0, 0 );
                    }
                    

                    
                }else {
                    BookObj.rotation.set( 0, params.bookR, 0 );
                    BookObj.position.x = params.bookX;
                    Page1Obj.rotation.set( 0, params.page1, 0 );
                    Page2Obj.rotation.set( 0, params.page2, 0 );
                }


            },
            rotationFactor: this.initClass.rotation,
            maxDistance: 3,

            /*
            define params for applyParams() function
             */
            setRotation: function( addFactor ){

                if( Math.abs( addFactor ) > this.maxDistance ){
                    if( addFactor > 0){
                        addFactor = this.maxDistance;
                    } else {
                        addFactor = -this.maxDistance;
                    }
                }

                let currentRotation = this.rotation;

                currentRotation += addFactor * this.rotationFactor;

                currentRotation = ( currentRotation > 1 ) ? 1 :
                    ( currentRotation < 0 ) ? 0 :
                        currentRotation;
                this.rotation = currentRotation;

                this.applyParams();
            }
        };

        /*
         Initialize Raycast to look for Mouse/Touch and animation work
         */

        let Raycast = new THREE.Raycaster();

        /*
        mouse params
         */
        let _mouse = {
            last: false,
            current: {
                x: 0,
                y: 0
            },
            start: {
                x: 0,
                y: 0
            },
            down: false,
            gap: {
                x: 0,
                y: 0
            },
            calcGap: function(){
                this.gap = {
                    x: (this.current.x - this.last.x ) / window.innerWidth,
                    y: (this.current.y - this.last.y ) / window.innerHeight
                };
            }
        };

        // Events
        let mouseDonwEvent = ( event ) => {
            // console.log("Mouse Down");
            if( Book.inAction ){
                return;
            }

            if( !_mouse.last ){
                _mouse.last = {
                    x: event.clientX,
                    y: event.clientY
                };
                _mouse.start = {
                    x: event.clientX,
                    y: event.clientY
                };
            }

            _mouse.current = {
                x: event.clientX,
                y: event.clientY
            };

            let v2Project = new THREE.Vector2( ((event.clientX / this.initClass.cardWidth)*2)-1, -((event.clientY / this.initClass.cardHeight)*2)+1 );
            Raycast.setFromCamera( v2Project, this.initClass.camera );
            let result = Raycast.intersectObjects( [ BookObj ], true );

            _mouse.down = result.length ? true : false;

        };
        let mouseMoveEvent = ( event ) => {
            // console.log("Mouse Move");
            let v2Project = new THREE.Vector2((event.clientX / this.initClass.cardWidth)*2-1, -2 *(event.clientY / this.initClass.cardHeight ) + 1 );
            Raycast.setFromCamera( v2Project, this.initClass.camera );
            let result = Raycast.intersectObjects( [ BookObj ], true );

            if(result.length){
                $('#envelope').css('cursor','pointer');
            }
            else{
                $('#envelope').css('cursor', 'default');
            }

            if( !_mouse.down ){
                return;
            }


            _mouse.last = {
                x: _mouse.current.x,
                y: _mouse.current.y
            };

            _mouse.current = {
                x: event.clientX,
                y: event.clientY
            };


            _mouse.calcGap();

            if(type.desk.type == 'wide') {
                Book.setRotation(_mouse.gap.y);
            }else
                Book.setRotation(_mouse.gap.x);

        };
        let mouseUpEvent = ( event ) => {
            // console.log("Mouse Up");
            let v2Project = new THREE.Vector2((event.clientX / this.initClass.cardWidth)*2-1, -2 *(event.clientY / this.initClass.cardHeight ) + 1 );
            Raycast.setFromCamera( v2Project, this.initClass.camera );
            let result = Raycast.intersectObjects( [ BookObj ], true );


            let dist = Math.abs(_mouse.current.x - _mouse.start.x) + Math.abs(_mouse.current.y - _mouse.start.y);

            if( dist < 5 && result.length ){
                Book.clickRotator();
            }

            _mouse.down = false;
            _mouse.last = false;
        };
        let eventMove = ( event ) => {
            // console.log("Event Move");
            this.initClass.CanvasParams.width = event.target.clientWidth;
            this.initClass.CanvasParams.height = event.target.clientHeight;
            let x = ( 'touches' in event ) ? event.touches["0"].clientX :  event.offsetX;
            let y = ( 'touches' in event ) ? event.touches["0"].clientY :  event.offsetY;

            let v2Project = new THREE.Vector2( ((x / this.initClass.cardWidth)*2)-1, -((y / this.initClass.cardHeight)*2)+1 );
            Raycast.setFromCamera( v2Project, this.initClass.camera );
            let result = Raycast.intersectObjects( [ BookObj ], true );
            if(result.length)
                event.preventDefault();

            mouseMoveEvent({
                clientX: x,
                clientY: y
            });
        };
        let eventDown = ( event ) => {
            // console.log("Event Down");
            this.initClass.CanvasParams.width = event.target.clientWidth;
            this.initClass.CanvasParams.height = event.target.clientHeight;
            let x = ( 'touches' in event ) ? event.touches["0"].clientX :  event.offsetX;
            let y = ( 'touches' in event ) ? event.touches["0"].clientY :  event.offsetY;

            let v2Project = new THREE.Vector2( ((x / this.initClass.cardWidth)*2)-1, -((y / this.initClass.cardHeight)*2)+1 );
            Raycast.setFromCamera( v2Project, this.initClass.camera );
            let result = Raycast.intersectObjects( [ BookObj ], true );
            if(result.length)
                event.preventDefault();

            if(this.initClass.allow) {
                mouseDonwEvent({
                    clientX: x,
                    clientY: y
                });
            }
        };
        let eventUp = ( event ) => {
            // console.log("Event Up");
            this.initClass.CanvasParams.width = event.target.clientWidth;
            this.initClass.CanvasParams.height = event.target.clientHeight;
            let x = ( 'touches' in event ) ? event.changedTouches["0"].clientX :  event.offsetX;
            let y = ( 'touches' in event ) ? event.changedTouches["0"].clientY :  event.offsetY;
            // let x = 1;
            // let y = 1;
            if(this.initClass.allow) {
                mouseUpEvent({
                    clientX: x,
                    clientY: y
                });
            }
        };


        this.removeListeners = () => {
            this.initClass.renderer.domElement.removeEventListener('mousedown', eventDown );
            this.initClass.renderer.domElement.removeEventListener('mousemove', eventMove );
            window.removeEventListener('mouseup', eventUp );
            this.initClass.renderer.domElement.removeEventListener('touchstart', eventDown );
            this.initClass.renderer.domElement.removeEventListener('touchmove', eventMove );
            window.removeEventListener('touchend', eventUp );



            Book = null;
            Raycast = null;
        };

        this.initClass.renderer.domElement.addEventListener('mousedown', eventDown, false );
        this.initClass.renderer.domElement.addEventListener('mousemove', eventMove, false );
        window.addEventListener('mouseup', eventUp, false );
        this.initClass.renderer.domElement.addEventListener('touchstart', eventDown, false );
        this.initClass.renderer.domElement.addEventListener('touchmove', eventMove, false );
        window.addEventListener('touchend', eventUp, false );



        //  CONFIG for loading textures

        let CONFIG = {
                sides: [{
                    name: 'texture_envelope',
                    texture: 'images/envelopes/envelope_square_back.png'
                }, {
                    name: 'texture_down',
                    texture: 'images/envelopes/envelope_square_front.png'
                }, {
                    name: 'front',
                    texture: type.desk.img.front
                }, {
                    name: 'inside_left',
                    texture: type.desk.img.left_inside
                }, {
                    name: 'inside_right',
                    texture: type.desk.img.right_inside
                },{
                    name: 'back',
                    texture: type.desk.img.back
                }]
        };


        let initTexture = [];

        function initSide( nextSide ){

            var manager = new THREE.LoadingManager();
            self[nextSide.name] = new THREE.Texture();
            self[nextSide.name].magFilter = THREE.LinearFilter;
            self[nextSide.name].minFilter = THREE.LinearFilter;
            var loader = new THREE.ImageLoader( manager );
            self[nextSide.name].image = loader.load( nextSide.texture );
            self[nextSide.name].needsUpdate = true;



            manager.onLoad = () => {
                initTexture.push(true);
            };


            // object.traverse(function( children ){
            //     if( children.name === nextSide.name ){
            //
            //
            //
            //     }
            // });
        }

        for( let i = 0; i < CONFIG.sides.length; i++ ){

            initSide( CONFIG.sides[i] );

        }


        let BookObj = new THREE.Object3D();
            BookObj.name = 'Book';
        this.initClass.scene.add( BookObj );
        let Page1Obj = new THREE.Object3D();
            BookObj.add( Page1Obj );
        let Page2Obj = new THREE.Object3D();
            BookObj.add( Page2Obj );


        this.destroy = function(){
            this.removeListeners();
            this.pagesArray = null;
            let toDispose = [
                texture_envelope,
                texture_down,
                front,
                inside_left,
                inside_right,
                back,
            ];
            for( let i = 0; i < toDispose.length; i++ ){
                if( toDispose[i] && toDispose[i].image ) toDispose[i].image = null;
                if( toDispose[i] && toDispose[i].dispose ) toDispose[i].dispose();
            }
        };

        /*
          Load card's model and apply textures
         */
        let loader = new THREE.OBJLoader();

        this.pagesArray = [ false, false, false, false ];

        // let e = [];


        loader.load( type.desk.obj,  ( object ) => {

            /*
            pageses contatiner
            false = page didnt load yet
             */

            let pages = this.pagesArray;

            let sTest;

            if(type.desk.type == 'square'){
                object.traverse((child) => {
                    /*
                     Traverse works like a forEach for Three.js
                     */

                    if ( child instanceof THREE.Mesh ) {

                        let c = child.clone();
                        c.material = new THREE.MeshPhongMaterial({side: THREE.BackSide, alphaTest: 1})
                        // e.push({p: child, c: c});
                        c.castShadow = c.receiveShadow = true;
                        child.material.transparent = true;
                        child.material.side = 2;
                        if (child.name == 'Plane 1') {
                            child.material.map = self.texture_envelope;
                            child.position.x = -16.3;
                            child.position.y = -1;
                            child.rotation.z = -1.58;
                            child.position.z = -0.24;
                            child.scale.x = 0.9;
                            child.scale.y = 1.25;
                            child.receiveShadow = true;
                        }
                        if (child.name == 'Plane 2') {
                            child.material.map = self.texture_down;
                            child.position.z = 1.5;
                            child.position.x = -16.3;
                            child.rotation.z = -1.58;
                            child.position.y = -1;
                            child.scale.x = 0.9;
                            child.scale.y = 1.25;
                        }
                        if (child.name == 'Plane 3') {

                            child.visible = false;
                            child.position.z = -2;
                            if (window.innerWidth > 800) {
                                child.position.x = -220;
                                child.position.y = 75;
                            }
                            else {
                                child.position.x = -230;
                                child.position.y = 70;
                            }

                            child.scale.y = 10;
                            child.scale.x = 10;
                            child.receiveShadow = true;
                        }

                        if (child.name == 'Plane001') {
                            child.material.map = self.front;
                            child.scale.x = 0.85;
                            child.scale.y = 1.2;
                            child.material.side = 0;
                            child.position.z = -0.01;

                            child.material.map.offset.x = 1;
                            child.material.map.wrapS = 1002;
                            child.material.map.wrapT = 1002;

                            child.material.color.r = 0.92;
                            child.material.color.g = 0.95;
                            child.material.color.b = 0.95;

                            pages[0] = child;


                            sTest = new THREE.Mesh( child.geometry.clone(),child.material.clone() );
                            sTest.name = 'Plane003';

                            sTest.material.color.r = 0.88;
                            sTest.material.color.g = 0.88;
                            sTest.material.color.b = 0.88;

                            sTest.material.map = self.inside_right;

                            sTest.material.map.wrapS = 1002;
                            sTest.material.map.wrapT = 1002;
                            sTest.material.map.offset.x = 1;
                            sTest.scale.x = 0.85;
                            sTest.scale.y = 1.2;
                            sTest.material.side = 0;
                            sTest.receiveShadow = true;
                            sTest.castShadow = true;

                            pages[2] = sTest;
                            sTest.position.y = 8.8;
                            sTest.rotation.z = Math.PI/2;
                        }
                        if (child.name == 'Plane002') {
                            child.material.color.r = 0.88;
                            child.material.color.g = 0.88;
                            child.material.color.b = 0.88;

                            child.material.side = 1;
                            child.material.map = self.inside_left;
                            child.scale.x = 0.85;
                            child.scale.y = 1.2;
                            child.position.z = 0.27;

                            child.receiveShadow = true;


                            child.material.map.wrapS = 1002;
                            child.material.map.wrapT = 1002;
                            pages[1] = child;
                        }

                        if (child.name == 'Plane003') {
                            // child.material.color.r = 0.88;
                            // child.material.color.g = 0.88;
                            // child.material.color.b = 0.88;
                            //
                            // child.material.map = inside_right;
                            // child.scale.x = 0.85;
                            // child.scale.y = 1.2;
                            // child.material.side = 1;
                            // child.receiveShadow = true;
                            // child.castShadow = true;
                             child.visible = false;
                            //pages[2] = child;
                        }

                        if (child.name == 'Plane004') {
                            child.material.color.r = 0.88;
                            child.material.color.g = 0.88;
                            child.material.color.b = 0.88;

                            child.material.map = self.back;
                            child.material.side = 0;
                            child.scale.x = 0.85;
                            child.scale.y = 1.2;

                            pages[3] = child;
                        }
                        if (['Plane002'].indexOf(child.name) != -1) {
                            child.castShadow = true;
                        }
                        if (['Plane001', 'Plane002', 'Plane003', 'Plane004'].indexOf(child.name) != -1) {
                            child.position.y = 8.8;
                            child.rotation.z = Math.PI / 2;
                        }
                    }
                });

                Page2Obj.add(pages[0]);
                Page2Obj.add(pages[1]);
                Page1Obj.add(pages[2]);
                Page1Obj.add(pages[3]);

                let setTranslateFactor = function (translateFactor) {
                    Page1Obj.position.x = translateFactor;
                    Page1Obj.position.z = -translateFactor + (-0.07);
                    Page2Obj.position.x = translateFactor;
                    Page2Obj.position.z = -translateFactor;
                };

                setTranslateFactor(7.07);

                BookObj.position.z = 8.8;
                BookObj.position.y = 13;
                object.position.y = 23;
                object.rotation.z = 1.58;
                object.position.z = -1.2;

                object.name = 'model';

                this.initClass.scene.add(object);

                Book.applyParams();

                this.time = Date.now() + 4000;


                let _interv = setInterval(() => {
                   if(initTexture.length === 6 && this.time < Date.now()){
                        clearInterval(_interv);
                        setTimeout(() => {
                            this.initClass.parseModel();
                            $('#magic').hide();
                        }, 500);
                    }
                }, 400);

                $('#envelope canvas').css('position', 'relative');
                $('#envelope canvas').css('z-index', '1000');

              /*  if (window.innerWidth > 800) {
                    $('#drag').css('left', $('#envelope canvas').width() / 100 * 90);
                    $('#btn').css('margin-top', -250);
                }*/




            }
            else if(type.desk.type == 'portrait'){

                object.traverse(  ( child ) => {
                    /*
                     Traverse works like a forEach for Three.js
                     */

                    if ( child instanceof THREE.Mesh ) {

                        let c = child.clone();
                        c.material = new THREE.MeshStandardMaterial({side:THREE.BackSide,alphaTest:1})
                        // e.push({p:child,c:c});
                        c.castShadow = c.receiveShadow = true;
                        child.material.transparent = true;
                        child.material.side = 2;
                        if(child.name == 'Plane 1') {
                            child.material.map = self.texture_envelope;
                            child.position.x = -6.3;
                            child.position.y = -1;
                            child.receiveShadow = true;
                            child.rotation.z = -1.58;

                        }
                        if(child.name == 'Plane 2') {
                            child.material.map = self.texture_down;
                            child.position.z = 0.04;
                            child.position.x = -6.3;
                            child.rotation.z = -1.58;
                            child.position.y = -1;
                            child.position.z = 1.15;
                        }
                        if(child.name == 'Plane 3') {

                            child.position.z = -2;
                            child.position.x = -215.5;
                            child.scale.y = 10;
                            child.scale.x = 10;

                            if(this.initClass.mobile)
                                child.position.x = -220;

                            child.receiveShadow = true;

                            child.visible = false;
                        }

                        if(child.name == 'Plane001'){
                            child.position.z = -0.01;
                            // child.material.color.g = 0.5;
                            child.material.map = self.front;
                            child.material.map.offset.x = 1;
                            child.material.map.wrapS = 1002;
                            child.material.map.wrapT = 1002;
                            child.material.side = 0;
                            pages[0] = child;

                            child.material.color.r = 0.92;
                            child.material.color.g = 0.95;
                            child.material.color.b = 0.95;

                            child.scale.y = 0.99;


                            sTest =new THREE.Mesh(child.geometry.clone(),child.material.clone());
                            sTest.name = 'Plane003';
                            sTest.material.side = 0;
                            sTest.scale.y = 0.99;
                            sTest.material.color.r = 0.88;
                            sTest.material.color.g = 0.88;
                            sTest.material.color.b = 0.88;
                            sTest.material.map = self.inside_right;
                            sTest.material.map.offset.x = 1;
                            sTest.material.map.wrapS = 1002;
                            sTest.material.map.wrapT = 1002;
                            sTest.receiveShadow = true;
                            sTest.castShadow = true;
                            pages[2] = sTest;
                            sTest.position.y = 8.8;
                            sTest.rotation.z = Math.PI/2;
                        }
                        if(child.name == 'Plane002'){
                            child.material.side = 1;
                            child.material.map = self.inside_left;
                            child.material.color.r = 0.88;
                            child.material.color.g = 0.88;
                            child.material.color.b = 0.88;
                            child.scale.y = 0.99;
                            child.receiveShadow = true;
                            child.position.z = 0.2;
                            pages[1] = child;
                        }
                        if(child.name == 'Plane003'){
                            // child.material.side = 1;
                            // child.material.color.r = 0.88;
                            // child.material.color.g = 0.88;
                            // child.material.color.b = 0.88;
                            //
                            // child.material.map = inside_right;
                            // child.material.map.offset.y = 1;
                            // child.material.map.wrapS = 1002;
                            // child.material.map.wrapT = 1002;
                            // child.receiveShadow = true;
                            // child.castShadow = true;
                            child.visible =false;
                          //  pages[2] = child;

                        }
                        if(child.name == 'Plane004'){
                            child.material.color.r = 0.88;
                            child.material.color.g = 0.88;
                            child.material.color.b = 0.88;
                            child.scale.y = 0.99;
                            child.position.z = 0.35;
                            if(this.initClass.mobile)
                                child.position.z = 0.65;
                            child.material.map = self.back;
                            child.material.side = 0;
                            pages[3] = child;
                        }

                        if( ['Plane002'].indexOf( child.name )  != -1 ){
                            child.castShadow = true;
                        }

                        if( ['Plane001','Plane002','Plane003','Plane004'].indexOf( child.name  )  != -1 ){
                            child.position.y = 8.8;
                            child.rotation.z = Math.PI/2;
                        }
                    }
                } );

                Page2Obj.add( pages[0] );
                Page2Obj.add( pages[1] );
                Page1Obj.add( pages[2] );
                Page1Obj.add( pages[3] );

                Page1Obj.position.x = 7.07;
                Page1Obj.position.z = -7.21;
                Page2Obj.position.x = 7.07;
                Page2Obj.position.z = -7.07;


                BookObj.position.z = 10;
                BookObj.position.x = 8;
                BookObj.position.y = 9.3;
                object.position.y = 8;
               // object.position.x = -2;
                object.rotation.z = 1.58;

                object.name = 'model';

                this.initClass.scene.add( object );
                Book.applyParams();

                this.time = Date.now() + 4000;


                let _interv = setInterval(() => {
                    if(initTexture.length === 6 && this.time < Date.now()){
                        clearInterval(_interv);
                        setTimeout( () => {
                            this.initClass.parseModel();
                            $('#magic').hide();
                            $('#envelope canvas').css('position', 'relative');
                            $('#envelope canvas').css('z-index', '1000');
                        }, 1200);
                    }
                },400);


                //if(window.innerWidth > 800) {
                //  $('#drag').css('left', $('#envelope canvas').width() / 100 * 90);
                //    $('#btn').css('margin-top', -130);

                //}
                //else{
                //    $('#btn').css('margin-top', -90);
                //}
            }
            else if(type.desk.type  == 'wide'){

                object.traverse(  ( child ) => {
                    /*
                     Traverse works like a forEach for Three.js
                     */
                    if ( child instanceof THREE.Mesh ) {
                        let c = child.clone();
                        c.material = new THREE.MeshPhongMaterial({side:THREE.BackSide,alphaTest:1})
                        // e.push({p:child,c:c});
                        c.castShadow = c.receiveShadow = true;
                        child.material.transparent = true;
                        child.material.side = 2;
                        if(child.name == 'Plane 1') {
                            child.material.map = self.texture_envelope;
                            child.position.y = -15;
                            child.receiveShadow = true;
                        }
                        if(child.name == 'Plane 2') {
                            child.material.map = self.texture_down;
                            child.position.z = 0.75;
                            child.position.y = -15;
                        }
                        if(child.name == 'Plane 3') {

                            child.position.z = -8;
                            child.scale.y = 10;
                            child.scale.x = 10;
                            child.position.y = -380;

                            if(this.initClass.mobile){
                                child.position.y = -390;

                            }

                            child.receiveShadow = true;
                            child.visible = false;
                        }

                        if(child.name == 'Plane001'){
                            child.material.map = self.front;
                            child.position.z = -0.35;
                            if(!this.initClass.mobile)
                                child.position.z = -0.82;

                            child.material.color.r = 0.8;
                            child.material.color.g = 0.8;
                            child.material.color.b = 0.8;

                            child.scale.x = 0.99;
                            pages[0] = child;
                        }
                        if(child.name == 'Plane002'){
                            child.material.color.r = 0.8;
                            child.material.color.g = 0.8;
                            child.material.color.b = 0.8;

                            child.material.side = 1;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material.map = self.inside_left;
                            child.position.z = -0.35;
                            if(!this.initClass.mobile)
                                child.position.z = -0.8;
                            child.material.map.offset.y = 1;
                            child.material.map.wrapS = 1002;
                            child.material.map.wrapT = 1002;

                            child.scale.x = 0.99;

                            pages[1] = child;
                        }
                        if(child.name == 'Plane003'){
                            child.material.color.r = 0.8;
                            child.material.color.g = 0.8;
                            child.material.color.b = 0.8;

                            child.material.map = self.inside_right;
                            child.position.z = 0.02;
                            if(!this.initClass.mobile)
                                child.position.z = 0.8;
                            child.material.map.offset.x = 1;
                            child.material.map.wrapS = 1002;
                            child.material.map.wrapT = 1002;
                            child.receiveShadow = true;
                            child.castShadow = true;
                            child.material.side = 1;

                            child.scale.x = 0.99;
                            pages[2] = child;
                        }
                        if(child.name == 'Plane004'){
                            child.material.color.r = 0.8;
                            child.material.color.g = 0.8;
                            child.material.color.b = 0.8;

                            child.material.map = self.back;
                            child.rotation.y = 3.14;
                            child.material.side = 1;
                            child.material.map.offset.y = 1;
                            child.material.map.wrapS = 1002;
                            child.material.map.wrapT = 1002;
                            child.position.z = 0.02;
                            if(!this.initClass.mobile)
                                child.position.z = 0.8;

                            child.scale.x = 0.99;
                            pages[3] = child;
                        }
                    }
                });

                Page2Obj.add( pages[0] );
                Page2Obj.add( pages[1] );
                Page1Obj.add( pages[2] );
                Page1Obj.add( pages[3] );
                Book.applyParams();

                BookObj.position.y = 13.5;
                if(!this.initClass.mobile)
                    BookObj.position.z = -0.3;


                Page1Obj.position.y = -17.07;
                Page1Obj.position.z = -17.07;
                Page2Obj.position.y = -17.07;
                Page2Obj.position.z = -17.07;

                object.position.y = 17;
                object.position.z = -21.7;

                object.name = 'model';

                this.time = Date.now() + 4000;


                let _interv = setInterval(() => {
                    if(initTexture.length === 6 && this.time < Date.now()){
                        clearInterval(_interv);
                        setTimeout( () => {
                            this.initClass.parseModel();
                            $('#magic').hide();
                            $('#envelope canvas').css('position', 'relative');
                            $('#envelope canvas').css('z-index', '1000');
                        }, 1200);

                    }
                },400);
                this.initClass.scene.add( object );


            }

            /*
            show "drag and rotate" block
             */
           // $('#drag').show();
        });

    }
}


 /*
    Run Viewer class
 */
new Viewer(conf);



/// When you close popup use scene.destroy();
