import { Context } from '../main'
import { Chatbox } from '../components/Chatbox'
import Mychats from '../components/Mychats'
import { Sidedrawer } from '../components/ui/Sidedrawer'
import { useContext } from 'react';
import { useState } from 'react';
const chats = () => {
    const { user } = useContext(Context);
    const [fetchAgain, setFetchAgain] = useState(false);
    return (
        <div style={{ width: '100%' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '100vh',
                    padding: '10px'
                }}
            >
                {user && <Sidedrawer />}
                {user && <Mychats fetchAgain={fetchAgain} />}      {/* <-- Move this here */}
                {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </div>
        </div>
    )
}

export default chats;