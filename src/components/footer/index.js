import React from 'react'
import "./Footer.css";
import { Icon } from '@iconify/react';
import { Divider, Text } from '@nextui-org/react';
import githubFill from '@iconify/icons-akar-icons/github-fill';
import linkedinIcon from '@iconify/icons-bi/linkedin';
import discordFill from '@iconify/icons-akar-icons/discord-fill';

const Footer = () => {
    return (
        <>

            <div id="footer">
                <div>
                    <Divider
                        css={{ position: 'absolute', inset: '0p', left: '0', mt: '0rem' }}
                    />
                </div>
                <div className="copy-right">
                    <div className="icons-container">
                        <a href="https://github.com/SahilJaiman/docmedsync" target="_blank" rel="noreferrer">
                            <Icon icon={githubFill} color="#455383" />
                        </a>
                        <a href="https://www.linkedin.com/in/sahil-jaiman-602abb113/" target="_blank" rel="noreferrer">
                            <Icon icon={linkedinIcon} color="#455383" />
                        </a>
                        <a href="https://discord.com/" target="_parent">
                            <Icon icon={discordFill} color="#455383" />
                        </a>
                    </div>
                    <div className="cr">
                        <Text> &copy; Copyright <strong><span>Docmedsync</span></strong>. All Rights Reserved</Text>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Footer
