import {execa} from 'execa';

const gitPushWithTagsAndUpstream = async (dryRun: boolean) => {
    if (dryRun) {
        return;
    }

    console.log('\nPushing tags');

    const {stdout} = await execa('git', ['branch', '--show-current']);

    try {
        await execa('git', ['push', '--follow-tags']);
    } catch (e) {
        try {
            await execa('git', ['push', '--set-upstream', 'origin', stdout, '--follow-tags']);
        } catch (e) {
            throw new Error(e);
        }
    }
};

export default gitPushWithTagsAndUpstream;
