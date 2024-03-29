import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Observable, Subject } from 'rxjs';



export class globalComponents {

    readonly signout = function() {
        firebase.auth().signOut().then( value => {
            alert("SignOutted")
        })
    }

    constructor(){
        this.userSessionCheckAuth()
    }

    kontol = false

    checkAuthSubject = new Subject<boolean>()
    checkLogin = firebase.auth()

    userSessionDestroy() {
        firebase.auth().signOut().then( value => {
            console.log(value)
        }).catch(errs => {
            console.error(errs)
        })
    }

    userSessionLogout() {
        firebase.auth().signOut().then( value => {
            console.error("Value", value)
        }).catch(err => {
            console.error(err);
        })
    }

    userSessionCheckAuth() {
        var authenticate = firebase.auth()
        var currentUser = authenticate.currentUser
        authenticate.onAuthStateChanged( observer2 => {
            this.checkAuthSubject.next(firebase.auth().currentUser !== null)
        }, (error) => {
            this.checkAuthSubject.error(error)
        })
    }

}
