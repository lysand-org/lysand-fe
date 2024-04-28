<template>
    <ClientOnly>
        <div class="w-full rounded ring-1 ring-white/10 pb-10">
            <Skeleton :enabled="skeleton" class="!w-full !h-full !aspect-[8/3]">
                <div class="w-full aspect-[8/3] border-b border-white/10 bg-dark-700">
                    <img v-if="account?.header" :src="account.header" class="object-cover w-full h-full"
                        :alt="`${account.acct}'s header image'`" />
                </div>
            </Skeleton>

            <div class="flex items-start justify-between px-4 py-3">
                <div class="h-32 w-32 -mt-[4.5rem] z-10 bg-dark-700 rounded overflow-hidden">
                    <Skeleton :enabled="skeleton" class="!h-full !w-full">
                        <img class="cursor-pointer bg-dark-700 ring-1 ring-white/10" :src="account?.avatar"
                            :alt="`${account?.acct}'s avatar'`" />
                    </Skeleton>
                </div>
                <ButtonsSecondary v-if="account">Edit Profile</ButtonsSecondary>
            </div>

            <div class="mt-2 px-4">
                <h2
                    class="text-xl font-bold text-gray-100 tracking-tight bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 text-transparent bg-clip-text">
                    <Skeleton :enabled="skeleton" :min-width="200" :max-width="350" class="h-6">
                        {{ account?.display_name }}
                        <Icon v-if="account?.locked" name="tabler:lock"
                            class="w-5 h-5 mb-0.5 text-gray-400 cursor-pointer"
                            title="This account manually approves its followers" />
                    </Skeleton>
                </h2>
                <span class="text-gray-400 block mt-2">
                    <Skeleton :enabled="skeleton" :min-width="130" :max-width="250">@{{ account?.acct }}</Skeleton>
                </span>
            </div>

            <div class="mt-4 px-4">
                <Skeleton :enabled="true" v-if="skeleton" class="!h-6" :min-width="50" :max-width="100" width-unit="%"
                    shape="rect" type="content">
                </Skeleton>
                <div class="prose prose-invert" v-html="parsedNote" v-else></div>
            </div>

            <div class="mt-3 flex items-center space-x-4 px-4">
                <div class="flex items-center space-x-1">
                    <Skeleton :enabled="skeleton" :min-width="150" :max-width="150" shape="rect">
                        <Icon name="tabler:calendar" class="w-5 h-5 text-gray-400" />
                        <span class="text-gray-400">Created {{ formattedJoin }}</span>
                    </Skeleton>
                </div>
                <div v-if="account?.bot" class="flex items-center space-x-1">
                    <Icon name="tabler:robot" class="w-5 h-5 text-gray-400" />
                    <span class="text-gray-400">Bot</span>
                </div>
            </div>

            <div class="mt-3 flex items-center space-x-4 px-4">
                <div class="cursor-pointer hover:underline space-x-1">
                    <Skeleton :enabled="skeleton" :min-width="100" :max-width="150" shape="rect">
                        <span class="font-bold text-gray-200">{{ account?.statuses_count }}</span>
                        <span class="text-gray-400">Posts</span>
                    </Skeleton>
                </div>
                <div class="cursor-pointer hover:underline space-x-1">
                    <Skeleton :enabled="skeleton" :min-width="100" :max-width="150" shape="rect">
                        <span class="font-bold text-gray-200">{{ account?.following_count }}</span>
                        <span class="text-gray-400">Following</span>
                    </Skeleton>
                </div>
            </div>

            <div v-if="!skeleton && parsedFields.length > 0" class="mt-4 px-4 flex-col flex space-y-3">
                <div v-for="field of parsedFields" :key="field.name" class="flex flex-col gap-1">
                    <span class="text-pink-500 font-semibold" v-html="field.name"></span>
                    <span class="text-gray-200 prose prose-invert break-all" v-html="field.value"></span>
                </div>
            </div>

            <div v-else-if="skeleton" class="mt-4 px-4 flex-col space-y-3">
                <div v-for="_ of 3" class="flex flex-col gap-1">
                    <Skeleton :enabled="skeleton" :min-width="10" :max-width="100" width-unit="%" shape="rect">
                    </Skeleton>
                    <Skeleton :enabled="skeleton" :min-width="10" :max-width="100" width-unit="%" shape="rect">
                    </Skeleton>
                </div>
            </div>
        </div>
    </ClientOnly>
</template>

<script lang="ts" setup>
import type { Account } from "~/types/mastodon/account";

const props = defineProps<{
    account?: Account;
}>();

const skeleton = computed(() => !props.account);

const formattedJoin = computed(() =>
    Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
    }).format(new Date(props.account?.created_at ?? 0)),
);

const parsedNote = ref("");
const parsedFields: Ref<
    {
        name: string;
        value: string;
    }[]
> = ref([]);

watch(
    skeleton,
    async () => {
        if (skeleton.value) return;
        parsedNote.value =
            useParsedContent(
                props.account?.note ?? "",
                props.account?.emojis ?? [],
            ).value ?? "";
        parsedFields.value =
            props.account?.fields.map((field) => ({
                name:
                    useParsedContent(field.name, props.account?.emojis ?? [])
                        .value ?? "",
                value:
                    useParsedContent(field.value, props.account?.emojis ?? [])
                        .value ?? "",
            })) ?? [];
    },
    {
        immediate: true,
    },
);
</script>