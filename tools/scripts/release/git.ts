import {execa} from 'execa';

const gitPushWithTagsAndUpstream = async (dryRun: boolean) => {
    if (dryRun) {
        return;
    }

    console.log('\nPushing tags');

    const {stdout} = await execa('git', ['branch', '--show-current']);

    try {
        await execa('git', ['push', '--follow-tags']);
    } catch (e1) {
        try {
            await execa('git', ['push', '--set-upstream', 'origin', stdout, '--follow-tags']);
        } catch (e2) {
            throw new Error(e2 || e1);
        }
    }
};

export default gitPushWithTagsAndUpstream;
