import * as THREE from 'three';
import PanoPoint from './PanoPoint';

export default {

    filterFunctions: {

        inDirection: function( cameraPosition: THREE.Vector3, cameraDirection: THREE.Vector3,  cosine: number ) 
        {
            return function( point: PanoPoint ) {
                
                var pointDirection = point.position.clone().sub( cameraPosition ).normalize();
                
                return pointDirection.dot( cameraDirection ) > cosine;
            }
        },

        inFloorDirection: function( poistionOnFloor: THREE.Vector3, direction: THREE.Vector3, cosine: number )
        {
            return function(n) {

                var floorDirection = n.floorPosition.clone().sub( poistionOnFloor ).normalize();

                return floorDirection.dot( direction ) > cosine;
            }
        },
        inPanoDirection: function( cameraPosition: THREE.Vector3, cameraDirection: THREE.Vector3, cosine?: number )
        {
            return cosine = cosine || 0.75,    //settings.navigation.panoScores ? settings.navigation.filterStrictness : i,

            function( testPoint: PanoPoint ) {

                var r = testPoint.getWorldPosition(new THREE.Vector3()).setY(testPoint.panoPosition.y).clone().sub( cameraPosition ).normalize();// testPoint.floorPosition.clone().sub( cameraPosition ).normalize()
                    //o = testPoint.panoPosition.clone().sub( cameraPosition ).normalize();
                return r.dot( cameraDirection ) > cosine //|| o.dot( cameraDirection ) > cosine;
            }
        },
        atFloor: function(e) {
            return function(t) {
                return !e || t.floor === e
            }
        },
        not: function( point: PanoPoint ) 
        {
            return function( testPoint: PanoPoint ) {
                return testPoint !== point;
            }
        },
        notIn: function(e) {
            return function(t) {
                return e.indexOf(t) === -1
            }
        },
        isLoaded: function() {
            return function(e) {
                return e.isLoaded()
            }
        },
        isNotLoaded: function() {
            return function(e) {
                return !e.isLoaded()
            }
        },
        isCloseEnoughTo: function(e, t) {
            return function(i) {
                return e.distanceTo(i.floorPosition) < t
            }
        },
        hasMinimumHeightDifferenceTo: function(e, t) {
            return function(i) {
                return Math.abs(i.position.y - e.y) > t
            }
        },
        isNotBehindNormal: function(e, t) {
            var i = new THREE.Vector3;
            return t = t.clone(),
            function(n) {
                var r = i.copy(n.position).sub(e).normalize();
                return r.dot(t) > 0
            }
        },
        isNeighbourPanoTo: function( point: PanoPoint ) 
        {
            return function( testPoint: PanoPoint ) {
                let n = !point || !point.neighbourMap || point.neighbourMap.get(testPoint.panoId);
                return n;
            }
        },
        isNeighbourOfNeighbourTo: function(e) {
            return function(t) {
                return !!e.neighbourPanos[t.id] || e.neighbourUUIDs.some(function(i) {
                    var n = e.model.panos.get(i);
                    return !!n && n.neighbourPanos[t.id]
                })
            }
        },
        isNotRecentlyFailed: function(e) {
            return function(t) {
                return Date.now() - t.failedLoadingAt > e
            }
        },
        isOnVisibleFloor: function() {
            return function(e) {
                return !e.floor.hidden
            }
        },
        isPanoAligned: function() {
            return function( testPoint: PanoPoint ) {
                return true // testPoint.isAligned()
            }
        }
    },

    scortFuntion: {

        distanceToPoint: function(e) {
            return function(t, i) {
                return t.position.distanceTo(e) - i.position.distanceTo(e)
            }
        },
        floorDistanceToPoint: function(e) {
            return function(t, i) {
                return t.floorPosition.distanceTo(e) - i.floorPosition.distanceTo(e)
            }
        },
        choose: function(e) {
            return function(t, i) {
                return e.id === t.id ? -1 : e.id === i.id ? 1 : 0
            }
        }

    },

    scoreJudges: {

        distance: function( point: PanoPoint, distanceFactor?: number) 
        {
            return distanceFactor = distanceFactor || -1, // settings.navigation.distanceFactor,
            function( testPoint: PanoPoint ) {
                return point ? point.position.distanceTo(testPoint.position) * distanceFactor : 0
            }
        },
        distanceSquared: function( point: PanoPoint, distanceFactor?: number) {
            return distanceFactor = distanceFactor || -1,   //settings.navigation.distanceFactor,
            function( testPoint: PanoPoint ) {
                return point ? point.position.distanceToSquared(testPoint.position) * distanceFactor : 0
            }
        },
        direction: function( cameraPosition: THREE.Vector3, cameraDirection: THREE.Vector3 ) {
            return function( testPoint: PanoPoint ) {
                var pointDirection = testPoint.getWorldPosition(new THREE.Vector3).clone().sub( cameraPosition ).normalize();
                return pointDirection.dot( cameraDirection ) * 10; //settings.navigation.directionFactor
            }
        },
        angle: function( cameraPosition: THREE.Vector3, cameraDirection: THREE.Vector3 ) {
            return function(i) {
                var pointDirection = i.position.clone().sub( cameraPosition ).normalize();
                return pointDirection.angleTo( cameraDirection ) * -30;//settings.navigation.angleFactor
            }
        },
        inFieldOfView: function(e, t) {
            return function(i) {
                var n = i.position.clone().sub(e).normalize();
                return n.dot(t) > .75 ? 10 : -1
            }
        },
        optionality: function(e) {
            return function(t) {
                var i = t.neighbourUUIDs.filter(function(t) {
                    return !(t in e.neighbourUUIDs) && t !== e.id
                });
                return i.length * 3;  //settings.navigation.optionalityFactor
            }
        },
        penalizeHeightDifferenceUnder: function(e, t) {
            return function(i) {
                return e.y - i.position.y < t ? -20 : 0
            }
        }
    },



}