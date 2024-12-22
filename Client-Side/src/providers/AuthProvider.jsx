import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    updateProfile 
} from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase.init';

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = async (email, password, displayName = '', photoURL = '') => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const createdUser = userCredential.user;

            // Update the profile with display name and photo URL
            if (displayName || photoURL) {
                await updateProfile(createdUser, { displayName, photoURL });
            }

            // Manually set the user to ensure immediate state update
            setUser({
                ...createdUser,
                displayName,
                photoURL,
            });

            setLoading(false);
            return createdUser;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setUser(userCredential.user); // Ensure user state is updated immediately
                setLoading(false);
                return userCredential.user;
            })
            .catch((error) => {
                setLoading(false);
                throw error;
            });
    };

    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
            .then((result) => {
                setUser(result.user); // Update user state for Google login
                setLoading(false);
                return result.user;
            })
            .catch((error) => {
                setLoading(false);
                throw error;
            });
    };

    const signOutUser = () => {
        setLoading(true);
        return signOut(auth).then(() => {
            setUser(null);
            setLoading(false);
        });
    };

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log('Current User:', currentUser);
            setUser(currentUser);
            setLoading(false);
        });

        return () => {
            unSubscribe();
        };
    }, []);

    const authInfo = {
        user,
        loading,
        createUser,
        signInUser,
        signInWithGoogle,
        signOutUser,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
