import React from 'react';
import PropTypes from 'prop-types';
import { fetchPopularRepos } from '../utils/api';
import Loading from './Loading';


function RepoGrid ({ repos }) {

    return (
        <ul className='popular-list'>
            {
                repos.map(({name, owner, stargazers_count, html_url}, index) => (
                        <li key={name} className='popular-item'>
                        <div className='popular-rank'>#{index + 1}</div>
                        <ul className='space-list-items'>
                            <li>
                                <img
                                    className='avatar'
                                    src={owner.avatar_url}
                                    alt={'Avatar for ' + owner.login}
                                    />

                            </li>
                            <li>
                                <a href={html_url}>{name}</a>
                            </li>
                            <li>@{owner.login}</li>
                            <li>{stargazers_count} stars</li>
                        </ul>
                    </li>
                    )
                )
            }
        </ul>
    )
}

RepoGrid.propTypes = {
    repos: PropTypes.array.isRequired
}

// Can be used without state
// Stateless Functional Component
function SelectLanguage({selectedLanguage, onSelect})  {
        const languages = ['All','Popular','Ruby','Java','CSS','Python'];
       return (
           <ul className="languages">
               {
                   languages.map((lang) => (
                <li
                    style={lang === selectedLanguage ? { color: '#d0021B'}: null}
                    onClick={() => onSelect(lang)}
                    key={lang}>
                    {lang}
                </li>
            ))}</ul>
       )
}


SelectLanguage.propTypes = {
    selectedLanguage: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};


//lifecylce events



class Popular extends React.Component {
    state = {
        selectedLanguage: 'All',
        repos: null
    };

    componentDidMount() {
        this.updateLanguage(this.state.selectedLanguage);
    }

    updateLanguage = (lang) => {
        this.setState(() => ({
                selectedLanguage: lang,
                repos: null})
        );

        // AJAX Request
        fetchPopularRepos(this.state.selectedLanguage)
            .then((repos) => (this.setState(() => ({
                        repos
                    }))))
    }

    render() {
        const {selectedLanguage, repos} = this.state;

        return (
            <div>
                <SelectLanguage selectedLanguage={selectedLanguage}
                                onSelect={this.updateLanguage}/>

                {!repos ?
                    <Loading speed={250} text={'Popular Stuff'}/>
                    :

                    <RepoGrid repos={repos}/>

                }
            </div>
        )
    }
}




export default Popular;
