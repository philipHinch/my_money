//components
import Spinner from '../components/Spinner';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileList from '../components/profile/ProfileList';
//hooks
import { useState } from 'react';

const Profile = ({ loading, setPhoto, photo, setDisplayName, displayName, isEdit, setIsEdit }) => {


    if (isEdit) {
        document.body.style.overflow = 'hidden'
    }

    if (!isEdit) {
        document.body.style.overflow = 'visible'
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <div className='profileContainer' >



            <h2 className="profileTitle">My Profile</h2>

            <ProfileHeader setPhoto={setPhoto} photo={photo} displayName={displayName} setDisplayName={setDisplayName} isEdit={isEdit} setIsEdit={setIsEdit} />

            <ProfileForm />

            <ProfileList />

        </div>
    );
}

export default Profile;