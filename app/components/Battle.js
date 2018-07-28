const React = require('react');
const PropTypes = require('prop-types');
const Link = require('react-router-dom').Link;
const PlayerPreview = require('./PlayerPreview');





class PlayerInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        const value  = event.target.value;
        // events need to be set to capture event variable
        this.setState(() => ({ username: value }));
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(
            this.props.id,
            this.state.username
        )
    }

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


PlayerInput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,

};

PlayerInput.defaultProps = {
    label: 'Username'
}

class Battle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerOneName: '',
            playerTwoName: '',
            playerOneImg: null,
            playerTwoImg: null,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleReset(id) {
        this.setState(function() {
            var newState = {};
            newState[id + 'Name'] = '';
            newState[id + 'Img'] = null;
            return newState;
        })
    }

    handleSubmit(id, username) {
        this.setState(() => ({
            [id + 'Name']: username,
            [id + 'Img']: `https://github.com/${username}.png?size=200`
        }))
    }


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

module.exports = Battle;