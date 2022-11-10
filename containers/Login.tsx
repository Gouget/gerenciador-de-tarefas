/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';
import { useState } from 'react';
import { executeRequest } from '../services/api';

type LoginProps = {
    setAccessToken(s:string) : void
}

export const Login : NextPage<LoginProps> = ({setAccessToken}) =>{

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const doLogin = async() => {
        try{
            if(!email || !password){
                return setError('Favor preencher os campos.');
            }

            setLoading(true);

            const body = {
                login: email,
                password
            };

            const result = await executeRequest('login', 'POST', body);
            if(result && result.data){
               localStorage.setItem('accessToken', result.data.token);
               localStorage.setItem('name', result.data.name);
               localStorage.setItem('email', result.data.email);
               setAccessToken(result.data.token);
            }
        }catch(e : any){
            console.log('Ocorreu erro ao efetuar login:', e);
            if(e?.response?.data?.error){
                setError(e?.response?.data?.error);
            }else{
                setError('Ocorreu erro ao efetuar login, tente novamente.');
            }
        }

        setLoading(false);
    }

    const signUp = async() => {
        try{
            if(!email || !password || !name){
                return setError('Favor preencher os campos.');
            }

            setLoading(true);

            const body = {
                name: name,
                email: email,
                password: password
            };

            const result = await executeRequest('user', 'POST', body);
            if(result && result.data){
               
                const body = {
                    login: email,
                    password: password
                };
    
                const result = await executeRequest('login', 'POST', body);
                if(result && result.data){
                   localStorage.setItem('accessToken', result.data.token);
                   localStorage.setItem('name', result.data.name);
                   localStorage.setItem('email', result.data.email);
                   setAccessToken(result.data.token);
                }
            }
        }catch(e : any){
            console.log('Ocorreu erro ao efetuar o cadastro:', e);
            if(e?.response?.data?.error){
                setError(e?.response?.data?.error);
            }else{
                setError('Ocorreu erro ao efetuar cadastro, tente novamente.');
            }
        }

        setLoading(false);
    }

    return (
        <>        
            <div className='container-login'>            
                <img src='/logo.svg' alt='Logo Fiap' className='logo'/>
                <div className="form">
                    {!isSignUp ? 
                        <div className='form-login'>
                            {error && <p>{error}</p>}
                            <div>
                                <img src='/mail.svg' alt='Login'/> 
                                <input type="text" placeholder="Login" 
                                    value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>
                            <div>
                                <img src='/lock.svg' alt='Password'/> 
                                <input type="password" placeholder="Password" 
                                    value={password} onChange={e => setPassword(e.target.value)}/>
                            </div>
                            <button type='button' onClick={doLogin} disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
                            <button className='button-signUp' type='button' onClick={_ => setIsSignUp(true)}>Sign Up</button>
                        </div>                                
                        : 
                        <div>
                            {error && <p>{error}</p>}
                            <div>
                                <img src='/user.svg' alt='Name'/> 
                                <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}/>
                            </div>
                            <div>
                                <img src='/mail.svg' alt='Email'/> 
                                <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>
                            <div>
                                <img src='/lock.svg' alt='Password'/> 
                                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                            </div>
                            <button type='button' onClick={signUp} disabled={loading}>{loading? 'Loading...' : 'Sign Up'}</button>
                            <button className='button-cancelar' type='button' onClick={_ => setIsSignUp(false)}>Cancel</button>
                        </div>
                    }           
                </div>       
            </div>        
        </>
    );
}