import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import PlayerPreview from './PlayerPreview';



class PlayerInput extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        onSubmit: PropTypes.func.isRequired,

    };

    static defaultProps = {
        label: 'Username'
    };

    state = {
        username: ''
    };

    handleChange = (event) => {
        const value  = event.target.value;
        // events need to be set to capture event variable
        this.setState(() => ({ username: value }));
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(
            this.props.id,
            this.state.username
        )
    };

    render() {
        const { username } = this.state;
        const { label } = this.props;

        return (
            <form className='column' onSubmit={this.handleSubmit}>
                <label className='header' htmlFor='username'>
                    {label}
                </label>
                <input id='username'
                       placeholder='github username'
                        type='text'
                        autoComplete='off'
                    value={username}
                onChange={this.handleChange}/>
                <button
                    className='button'
                    type='submit'
                    disabled={!username}
                >Submit</button>
            </form>
        )
    }
}




class Battle extends React.Component {
    state = {
        playerOneName: '',
        playerTwoName: '',
        playerOneImg: null,
        playerTwoImg: null,
    };

    handleReset = (id) => {
        this.setState(function() {
            var newState = {};
            newState[id + 'Name'] = '';
            newState[id + 'Img'] = null;
            return newState;
        })
    };

    handleSubmit = (id, username) => {
        this.setState(() => ({
            [id + 'Name']: username,
            [id + 'Img']: `https://github.com/${username}.png?size=200`
        }))
    };


    render() {
        const { match } = this.props;
        const { playerOneName, playerTwoName, playerOneImg, playerTwoImg } =  this.state;

        return (
                <div>
                    <div className='row'>

                        {!playerOneName &&
                        <PlayerInput
                        id='playerOne'
                        label='Player One'
                        onSubmit={this.handleSubmit}/>}

                        {playerOneImg !== null &&
                        <PlayerPreview avatar={playerOneImg} username={playerOneName}>
                            <button
                                className='reset'
                                onClick={this.handleReset}>
                                Reset
                            </button>
                        </PlayerPreview>}

                        {!playerTwoName &&
                        <PlayerInput id='playerTwo'
                        label='Player Two'
                        onSubmit={this.handleSubmit}/>}

                        {playerTwoImg !== null &&
                        <PlayerPreview avatar={playerTwoImg} username={playerTwoName}>
                            <button
                                className='reset'
                                onClick={this.handleReset}>
                                Reset
                            </button>
                        </PlayerPreview>}



                    </div>

                    {playerOneImg && playerTwoImg &&
                    <Link
                        className='button'
                        to={{
                            pathname: `${match.url}/results`,
                            search: `playerOneName=${playerOneName}
                                &playerTwoName=${playerTwoName}`
                        }
                        }>
                        Battle!
                    </Link>
                    }
                </div>
        )
    }
}

export default Battle;