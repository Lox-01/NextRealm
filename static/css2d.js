class CSS2DObject extends THREE.Object3D {
	constructor( element = document.createElement( 'div' ) ) {
		super();
		this.isCSS2DObject = true;
		this.element = element;
		this.element.style.position = 'absolute';
		this.element.style.userSelect = 'none';
		this.element.setAttribute( 'draggable', false );
		this.center = new THREE.Vector2( 0.5, 0.5 );
		this.addEventListener( 'removed', function () {
			this.traverse( function ( object ) {
				if (
					object.element instanceof object.element.ownerDocument.defaultView.Element &&
					object.element.parentNode !== null
				) {
					object.element.remove();
				}
			} );
		} );
	}
	copy( source, recursive ) {
		super.copy( source, recursive );
		this.element = source.element.cloneNode( true );
		this.center = source.center;
		return this;
	}
}
const _vector = new THREE.Vector3();
const _viewMatrix = new THREE.Matrix4();
const _viewProjectionMatrix = new THREE.Matrix4();
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
class CSS2DRenderer {
	constructor( parameters = {} ) {
		const _this = this;
		let _width, _height;
		let _widthHalf, _heightHalf;
		const cache = {
			objects: new WeakMap()
		};
		const domElement = parameters.element !== undefined ? parameters.element : document.createElement( 'div' );
		domElement.style.overflow = 'hidden';
		this.domElement = domElement;
		this.getSize = function () {
			return {
				width: _width,
				height: _height
			};
		};
		this.render = function ( scene, camera ) {
			if ( scene.matrixWorldAutoUpdate === true ) scene.updateMatrixWorld();
			if ( camera.parent === null && camera.matrixWorldAutoUpdate === true ) camera.updateMatrixWorld();
			_viewMatrix.copy( camera.matrixWorldInverse );
			_viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, _viewMatrix );
			renderObject( scene, scene, camera );
			zOrder( scene );
		};
		this.setSize = function ( width, height ) {
			_width = width;
			_height = height;
			_widthHalf = _width / 2;
			_heightHalf = _height / 2;
			domElement.style.width = width + 'px';
			domElement.style.height = height + 'px';
		};
		function hideObject( object ) {
			if ( object.isCSS2DObject ) object.element.style.display = 'none';
			for ( let i = 0, l = object.children.length; i < l; i ++ ) {
				hideObject( object.children[ i ] );
			}
		}
		function renderObject( object, scene, camera ) {
			if ( object.visible === false ) {
				hideObject( object );
				return;
			}
			if ( object.isCSS2DObject ) {
				_vector.setFromMatrixPosition( object.matrixWorld );
				_vector.applyMatrix4( _viewProjectionMatrix );
				const visible = ( _vector.z >= - 1 && _vector.z <= 1 ) && ( object.layers.test( camera.layers ) === true );
				const element = object.element;
				element.style.display = visible === true ? '' : 'none';
				if ( visible === true ) {
					object.onBeforeRender( _this, scene, camera );
					element.style.transform = 'translate(' + ( - 100 * object.center.x ) + '%,' + ( - 100 * object.center.y ) + '%)' + 'translate(' + ( _vector.x * _widthHalf + _widthHalf ) + 'px,' + ( - _vector.y * _heightHalf + _heightHalf ) + 'px)';
					if ( element.parentNode !== domElement ) {
						domElement.appendChild( element );
					}
					object.onAfterRender( _this, scene, camera );
				}
				const objectData = {
					distanceToCameraSquared: getDistanceToSquared( camera, object )
				};
				cache.objects.set( object, objectData );
			}
			for ( let i = 0, l = object.children.length; i < l; i ++ ) {
				renderObject( object.children[ i ], scene, camera );
			}
		}
		function getDistanceToSquared( object1, object2 ) {
			_a.setFromMatrixPosition( object1.matrixWorld );
			_b.setFromMatrixPosition( object2.matrixWorld );
			return _a.distanceToSquared( _b );
		}
		function filterAndFlatten( scene ) {
			const result = [];
			scene.traverseVisible( function ( object ) {
				if ( object.isCSS2DObject ) result.push( object );
			} );
			return result;
		}
		function zOrder( scene ) {
			const sorted = filterAndFlatten( scene ).sort( function ( a, b ) {
				if ( a.renderOrder !== b.renderOrder ) {
					return b.renderOrder - a.renderOrder;
				}
				const distanceA = cache.objects.get( a ).distanceToCameraSquared;
				const distanceB = cache.objects.get( b ).distanceToCameraSquared;
				return distanceA - distanceB;
			} );
			const zMax = sorted.length;
			for ( let i = 0, l = sorted.length; i < l; i ++ ) {
				sorted[ i ].element.style.zIndex = zMax - i + 99;
			}
		}
	}
}
/*class CSS2DObject extends THREE.Object3D{constructor(e=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=e,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new THREE.Vector2(.5,.5),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof e.element.ownerDocument.defaultView.Element&&null!==e.element.parentNode&&e.element.remove()})})}copy(e,t){return super.copy(e,t),this.element=e.element.cloneNode(!0),this.center=e.center,this}}const _vector=new THREE.Vector3,_viewMatrix=new THREE.Matrix4,_viewProjectionMatrix=new THREE.Matrix4,_a=new THREE.Vector3,_b=new THREE.Vector3;class CSS2DRenderer{constructor(e={}){let t=this,r,n,i,o,l={objects:new WeakMap},s=void 0!==e.element?e.element:document.createElement("div");function a(e){e.isCSS2DObject&&(e.element.style.display="none");for(let t=0,r=e.children.length;t<r;t++)a(e.children[t])}function c(e,r,n){if(!1===e.visible){a(e);return}if(e.isCSS2DObject){_vector.setFromMatrixPosition(e.matrixWorld),_vector.applyMatrix4(_viewProjectionMatrix);let u=_vector.z>=-1&&_vector.z<=1&&!0===e.layers.test(n.layers),m=e.element;m.style.display=!0===u?"":"none",!0===u&&(e.onBeforeRender(t,r,n),m.style.transform="translate("+-100*e.center.x+"%,"+-100*e.center.y+"%)translate("+(_vector.x*i+i)+"px,"+(-_vector.y*o+o)+"px)",m.parentNode!==s&&s.appendChild(m),e.onAfterRender(t,r,n));let h={distanceToCameraSquared:d(n,e)};l.objects.set(e,h)}for(let x=0,p=e.children.length;x<p;x++)c(e.children[x],r,n)}function d(e,t){return _a.setFromMatrixPosition(e.matrixWorld),_b.setFromMatrixPosition(t.matrixWorld),_a.distanceToSquared(_b)}function u(e){let t=[];return e.traverseVisible(function(e){e.isCSS2DObject&&t.push(e)}),t}function m(e){let t=u(e).sort(function(e,t){if(e.renderOrder!==t.renderOrder)return t.renderOrder-e.renderOrder;let r=l.objects.get(e).distanceToCameraSquared,n=l.objects.get(t).distanceToCameraSquared;return r-n}),r=t.length;for(let n=0,i=t.length;n<i;n++)t[n].element.style.zIndex=r-n+99}s.style.overflow="hidden",this.domElement=s,this.getSize=function(){return{width:r,height:n}},this.render=function(e,t){!0===e.matrixWorldAutoUpdate&&e.updateMatrixWorld(),null===t.parent&&!0===t.matrixWorldAutoUpdate&&t.updateMatrixWorld(),_viewMatrix.copy(t.matrixWorldInverse),_viewProjectionMatrix.multiplyMatrices(t.projectionMatrix,_viewMatrix),c(e,e,t),m(e)},this.setSize=function(e,t){r=e,n=t,i=r/2,o=n/2,s.style.width=e+"px",s.style.height=t+"px"}}}*/
