import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import GLManager from "../GLManager";
import PointCloudNode from '../pointCloud/PointCloudNode';


export default class GUIManager {
    
    rootDom: HTMLElement
    stats;
    gui;
    EasyEnum;
    EasySpeedEnum;

    constructor( rootDom: HTMLElement ) 
    {
        this.stats = new window['Stats']();

        this.rootDom = rootDom;
        rootDom.appendChild(this.stats.dom);
        this.gui = new window['dat']['GUI']();
        
        this.EasyEnum = {}
        this.EasySpeedEnum = { In: "In", Out:"Out", InOut:"InOut" }

        for( let k in TWEEN.Easing )
        {
            this.EasyEnum[k] = k
        }

    }


    public generateUIControls( glManager: GLManager )
    {   

        

            
        glManager.addEventListener("update", (message) => { 
            
            this.stats.update(); 
        
        })

        this.generateSceneHelper( glManager );
        this.generatePointCloudUI( glManager );
        this.generateCameraControllerUI( glManager );
        this.generateHotspotControllerUI( glManager );
    }


    private generateSceneHelper( glManager: GLManager ) {
        
        let gui = this.gui;
        let sceneHelpersUI = gui.addFolder("场景")
        
        let gridHelper = new THREE.GridHelper(1000,100);
        glManager.scene.add( gridHelper );
        let axesHelper = new THREE.AxesHelper(50);
        glManager.scene.add( axesHelper );
   
        sceneHelpersUI.add( gridHelper , 'visible', "网格");
        sceneHelpersUI.add( axesHelper, 'visible', "坐标轴");
    }

    
    private generatePointCloudUI( glManager: GLManager ) {

        if(!glManager.pointCloud) return;

        let pointCloud = glManager.pointCloud;
        let pointCloudMat = glManager.pointCloud.material;

        let boxHelpers = new THREE.Group();
            boxHelpers.visible = false;
            glManager.scene.add(boxHelpers);
        
        pointCloud.children.forEach( item => {

            let mesh = item as THREE.Mesh;
            let helper = new THREE.BoxHelper( mesh, new THREE.Color(0x0000ff));
            boxHelpers.add(helper);

            
            let center = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 30), new THREE.MeshBasicMaterial({ color:0xff0000, wireframe:true }))
            mesh.geometry.boundingBox.getCenter(center.position)
            boxHelpers.add(center);
        })


        let pointCloudTest = {

            pointSize: getInitUniform("pointSize"),
            pointColor: getInitUniform("pointColor"),
            fogColor: getInitUniform("fogColor"),
            fogBaseStrength: getInitUniform("fogBaseStrength"),
            fogHeightStrength: getInitUniform("fogHeightStrength"),

            duration: getInitPropoty("duration"),

            initDensity: getInitPropoty("initDensity"),
            hoverDensity: getInitPropoty("hoverDensity"),

            initHeight:  getInitUniform("initHeight"),
            initAmplitude: getInitUniform("initAmplitude"),

            hoverHeight:  getInitUniform("hoverHeight"),
            hoverAmplitude: getInitUniform("hoverAmplitude"),
        
        }

        function getInitUniform( key ) {
            let node = glManager.pointCloud.children[0] as PointCloudNode;
            return node.material.uniforms[key].value;
        }

        function changeAllUniform( key, value ) {
            glManager.pointCloud.children.forEach(item => {
                let node = item as PointCloudNode
                node.material.uniforms[key].value = value;
            })
        }

        function changeAllUniformColor( key, value ) {
            glManager.pointCloud.children.forEach(item => {
                let node = item as PointCloudNode
                node.material.uniforms[key].value = new THREE.Color(value.r,value.g,value.b);
            })
        }

        function getInitPropoty( key ) {

            let node = glManager.pointCloud.children[0] as PointCloudNode;
            return node[key];
        }

        function changeAllProperty( key, value )
        {
            glManager.pointCloud.children.forEach(item => {
                let node = item as PointCloudNode
                node[key] = value;
            })
        }

       
        let pointsUI = this.gui.addFolder("粒子");
            pointsUI.add( boxHelpers, 'visible', "包围盒")

        let groundUI = this.gui.addFolder("地面");
            groundUI.add( pointCloud.ground.material.uniforms.density, 'value', "密度",0, 1, 0.01)
            groundUI.add( pointCloud.ground.material.uniforms.initAmplitude, 'value', "噪声强度",0, 200, 0.01)
     

        let staticUI = pointsUI.addFolder("静态属性");
            staticUI.add( pointCloudTest, 'pointSize', "大小", 0.01, 80, 0.01).onChange( function(value){changeAllUniform('pointSize',value );  })
            staticUI.addColor( pointCloudTest, 'pointColor', "粒子颜色").onChange(function(value){ changeAllUniformColor("pointColor",value)  })
            staticUI.addColor( pointCloudTest, 'fogColor', "雾颜色").onChange(function(value){ changeAllUniformColor("fogColor",value) })
            staticUI.add( pointCloudTest, 'fogBaseStrength', "基本强度", 0, 0.01, 0.0001).onChange(function(value){ changeAllUniform("fogBaseStrength",value) });
            staticUI.add( pointCloudTest, 'fogHeightStrength', "高度衰减率", 0, 1, 0.001).onChange(function(value){ changeAllUniform("fogHeightStrength",value) });

        let initState = pointsUI.addFolder("初始状态");
            initState.add( pointCloudTest, 'initDensity', "密度", 0, 1, 0.01).onChange(  function(value){ changeAllProperty('initDensity',value ); changeAllUniform('density',value );  })
            initState.add( pointCloudTest, 'initHeight', "高度", 0, 1, 0.01).onChange(  function(value){changeAllUniform('initHeight',value );  })
            initState.add( pointCloudTest, 'initAmplitude', "噪声强度", 0, 50, 0.01).onChange(  function(value){changeAllUniform('initAmplitude',value );  }) 

        let hoverState = pointsUI.addFolder("鼠标悬停状态");
            hoverState.add( pointCloudTest, 'hoverDensity', "密度", 0, 1, 0.01).onChange(  function(value){ changeAllProperty('hoverDensity',value );  })
            hoverState.add( pointCloudTest, 'hoverHeight', "高度", 0, 1, 0.01).onChange(  function(value){changeAllUniform('hoverHeight',value );  })
            hoverState.add( pointCloudTest, 'hoverAmplitude', "噪声强度", 0, 50, 0.01).onChange(  function(value){changeAllUniform('hoverAmplitude',value );  }) 
        
        let anim = pointsUI.addFolder("过渡");
            anim.add( pointCloudTest, 'duration', "时长", 0, 5000, 200).onChange(  function(value){ changeAllProperty('duration',value );  });

    }


    /**
     * 相机动画UI
     */
    private generateCameraControllerUI( glManager: GLManager )
    {

        let cameraController = glManager.cameraController;

        let info = document.createElement("textarea")
        info.style.position ="fixed"
        info.style.top = "0";
        info.style.left = "20%";
        info.style.width = "500px"
        info.style.height = "100px"
        info.style.background = "rgba(0,0,0,0.5)"
        info.style.padding = "20px 10px";
        info.style.color = "#fff";
        info.style.pointerEvents ="all"
        info.innerText = "相机位置"
       
        this.rootDom.appendChild(info)

        let oribitHelper = new THREE.Mesh(
            new THREE.SphereGeometry(0.5,20,20),
            new THREE.MeshBasicMaterial({ wireframe:true, color: 0x0000ff })
        )
        oribitHelper.position.copy( cameraController.orbitControls["target"])
        glManager.scene.add(oribitHelper);
        glManager.addEventListener('update', ()=> {
            oribitHelper.position.copy( cameraController.orbitControls["target"])
            info.innerText = JSON.stringify(
                {"pos": glManager.camera.position, "pivot": cameraController.orbitControls["target"] }
            );
        })

        let cameraControllerTest = {

            tranlateDuration: 1000,
            tranlateDelay: 0,
            tranlateEase: this.EasyEnum.Circular,
            tranlateEaseSpeed: this.EasySpeedEnum.Out,

            rotateDuration: 1000,
            rotateDelay:0,
            rotateEasy: this.EasyEnum.Circular,
            rotateEasySpeed: this.EasySpeedEnum.Out,

            hotSpots: glManager.hotspotController.guideposts,
            index: 3,
            ready: true,
            progress: 0,
            mode: 1,
            test: function() {

                cameraController.animPositionDutation = this.tranlateDuration;
                cameraController.animPosition.delay(this.tranlateDelay).easing( TWEEN.Easing[this.tranlateEase][this.tranlateEaseSpeed] )

                cameraController.animRotationDutation = this.tranlateDuration;
                cameraController.animRotation.delay(this.rotateDelay).easing( TWEEN.Easing[this.rotateEasy][this.rotateEasySpeed] )

                if( this.hotSpots.length && this.ready )
                {
                    this.ready = false;
                    cameraController.moveToGuidepost( this.hotSpots[this.index] ).then(()=>{
                        this.ready = true;
                    })
                }
            },
            reset: function() {

                glManager.reset();
                this.ready = true;
            },
            copy: function() {

                info.select()
                document.execCommand("Copy")

            }
        }

        

        let cameraControllerUI = this.gui.addFolder("相机");
            cameraControllerUI.add( cameraControllerTest, 'tranlateDuration', '平移时长', 500, 10000, 500 );
            cameraControllerUI.add( cameraControllerTest, 'tranlateDelay', '平移延迟', 0, 3000, 100 );
            cameraControllerUI.add( cameraControllerTest, 'tranlateEase', '平移Easy', this.EasyEnum );
            cameraControllerUI.add( cameraControllerTest, 'tranlateEaseSpeed', '平移EasySpeed', this.EasySpeedEnum );
            
            cameraControllerUI.add( cameraControllerTest, 'rotateDuration', '旋转时长', 500, 10000, 500 );
            cameraControllerUI.add( cameraControllerTest, 'rotateDelay', '旋转延迟', 0, 3000, 100 );
            cameraControllerUI.add( cameraControllerTest, 'rotateEasy', '旋转Easy', this.EasyEnum );
            cameraControllerUI.add( cameraControllerTest, 'rotateEasySpeed', '旋转EasySpeed', this.EasySpeedEnum );

            cameraControllerUI.add( cameraControllerTest, 'index', '选择热点', { "唐碑":0, "文臣廊":1, "汉昭烈庙":2, "武侯祠":3 } ).onChange(function(value){	
                cameraControllerTest.ready = true;        
            });
            cameraControllerUI.add( cameraControllerTest, 'test', '动画演示' );
            cameraControllerUI.add( cameraControllerTest, 'reset', '重置相机位置' );
            cameraControllerUI.add( cameraControllerTest, 'mode', '相机模式', { '轨道视角':0, '位置锁定': 1 } ).onChange(function(value){
                cameraController.tabMode(Number(value));
                oribitHelper.visible = value == 0
            });
            cameraControllerUI.add( cameraController.orbitControls['target'], 'y', '视点高度',-5, 15, 0.01 )
            cameraControllerUI.add( cameraControllerTest, 'copy', "复制" )
        
    }


    private generateHotspotControllerUI( glManager: GLManager ) 
    {


    }


}