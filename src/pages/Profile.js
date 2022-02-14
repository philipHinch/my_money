//components
import Spinner from '../components/Spinner';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileList from '../components/profile/ProfileList';

const Profile = ({ loading, setPhoto, setDisplayName }) => {

    if (loading) {
        return <Spinner />
    }

    return (
        <div className='profileContainer' >
            <h2 className="profileTitle">My Profile</h2>

            <ProfileHeader setPhoto={setPhoto} setDisplayName={setDisplayName} />

            <ProfileForm />

            <ProfileList />

        </div>
    );
}

export default Profile;