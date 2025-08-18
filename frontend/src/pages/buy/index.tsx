import * as Yup from 'yup';
import { LuBellRing } from 'react-icons/lu';
import { FaRegHeart } from 'react-icons/fa';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// next
import Head from 'next/head';
// @mui
import {
  Box,
  Grid,
  Stack,
  Divider,
  Checkbox,
  Container,
  Typography,
  FormControlLabel,
} from '@mui/material';
// assets
import BedIcon from 'src/assets/icons/BedIcon';
import CarIcon from 'src/assets/icons/CarIcon';
import BathIcon from 'src/assets/icons/BathIcon';
import TickIcon from 'src/assets/icons/TickIcon';
import estateImage from 'src/assets/images/img.png';
import SquareIcon from 'src/assets/icons/SquareIcon';
import LocationIcon from 'src/assets/icons/LocationIcon';
import LocationAreaIcon from 'src/assets/icons/LocationAreaIcon';
// layouts
import MainLayout from 'src/layouts/main/MainLayout';
// config
import { HEADER } from 'src/config-global';
// locales
import { useLocales } from 'src/locales';
// utils
import { fNumber } from 'src/utils/formatNumber';
// components
import Map from 'src/components/map/Map';
// import EstateCard from 'src/components/customs/EstateCard';
import Breadcrumb from 'src/components/customs/Breadcrumb';
import RoundButton from 'src/components/customs/RoundButton';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// sections
import ServiceCarousel from 'src/sections/service/ServiceCarousel';

// ----------------------------------------------------------------------

BuyPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

const list = [
  {
    id: '1',
    title: '1',
    description: '1',
    image: estateImage.src,
  },
  {
    id: '2',
    title: '2',
    description: '2',
    image: estateImage.src,
  },
  {
    id: '3',
    title: '3',
    description: '3',
    image: estateImage.src,
  },
];

// ----------------------------------------------------------------------

type FormValuesProps = {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  afterSubmit?: string;
};

export default function BuyPage() {
  const { t } = useLocales();

  const RegisterSchema = Yup.object().shape({});

  const defaultValues = {
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setError,
    handleSubmit,
    // formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const values = watch();
  console.log(values);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message || error,
      });
    }
  };

  return (
    <>
      <Head>
        <title>{t(`buy`)}</title>
      </Head>

      <Container maxWidth="lg">
        <Box sx={{ my: `${HEADER.H_MAIN_SPACING}px` }}>
          <ServiceCarousel data={list} />
        </Box>

        <Stack alignItems="center" sx={{ my: 4 }}>
          <Box sx={{ height: '90px', width: '728px', bgcolor: '#D9D9D9' }} />
        </Stack>

        <Grid container xs={12} md={12} spacing={4}>
          <Grid item xs={8} md={8}>
            <Stack spacing={2} sx={{ bgcolor: 'common.white', borderRadius: '10px', p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between">
                <Breadcrumb
                  title={`${t(`home`)} » ${t(`our_properties`)} » ${t(`buy`)}`}
                  breadcrumbItem="Nome do imóvel lorem ipsum"
                />
                <Stack direction="row" spacing={2} alignItems="center">
                  <FaRegHeart size={18} />
                  <LuBellRing size={18} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    {t(`buy`)}
                  </Typography>
                </Stack>
              </Stack>

              <Typography variant="h1" color="primary">
                {t(`Nome do imovel lorem ipsum`)}
              </Typography>

              <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={2}>
                  <RoundButton variant="contained" color="secondary">
                    <Typography variant="overline" sx={{ textTransform: 'none' }}>
                      {t(`card.featured`)}
                    </Typography>
                  </RoundButton>
                  <RoundButton variant="contained" color="info">
                    <Typography variant="overline" sx={{ textTransform: 'none' }}>
                      {t(`buy`)}
                    </Typography>
                  </RoundButton>
                </Stack>
                <Stack
                  spacing={1}
                  direction="row"
                  alignItems="start"
                  justifyContent="flex-start"
                  sx={{ pt: 1 }}
                >
                  <LocationIcon />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Av. Lorem Ipsum Dolor Sit Amet São Paulo - SP
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={4}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BedIcon />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {`3 ${t(`card.bedrooms`)}`}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BathIcon />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {`1 ${t(`card.suite`)}`}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CarIcon />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {`6 ${t(`card.vacancies`)}`}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <SquareIcon />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {`${`394`}m² (${t(`card.usable_area`).toLowerCase()})`}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <SquareIcon />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {`${`394`}m² (${t(`propertiesPage.total_area`).toLowerCase()})`}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack
                  spacing={1}
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  sx={{ pt: 2 }}
                >
                  <Typography variant="subtitle1"> {t(`card.from`)}</Typography>
                  <Typography variant="subtitle1">R$</Typography>
                  <Typography variant="h3">{fNumber(8200000)}</Typography>
                </Stack>
              </Stack>

              <Divider />

              <Stack direction="column" spacing={1}>
                <Typography variant="h4" color="primary">
                  {t(`buyPage.about_property`)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer auctor arcu at
                  sapien efficitur, in porta velit auctor. Sed ut nibh sed nulla tristique
                  tristique. Mauris non viverra massa. Quisque ac mauris in lectus tempor vulputate.
                  Donec nec erat purus. Orci varius natoque penatibus et magnis dis parturient
                  montes, nascetur ridiculus mus. Donec vel dui placerat orci venenatis suscipit.
                  Vivamus in ante mollis, tincidunt ante a, pharetra turpis.`)}
                </Typography>
              </Stack>

              <Divider />

              <Stack direction="column" spacing={1}>
                <Typography variant="h4" color="primary">
                  {t(`advertisePage.property_features`)}
                </Typography>
                <Stack direction="column" spacing={1}>
                  {[...new Array(6)].map(() => (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <TickIcon />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {t(`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              <Divider />

              <Stack direction="column" spacing={1}>
                <Typography variant="h4" color="primary">
                  {t(`advertisePage.property_proximity`)}
                </Typography>
                <Stack direction="column" spacing={1}>
                  {[...new Array(9)].map(() => (
                    <Stack direction="row" spacing={2} alignItems="start">
                      <LocationAreaIcon />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {t(`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={4} md={4} spacing={2}>
            <Stack spacing={2}>
              <Box sx={{ bgcolor: 'common.white', borderRadius: '15px', p: 2.5 }}>
                <Map />
              </Box>

              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2} sx={{ bgcolor: 'common.white', borderRadius: '10px', p: 2.5 }}>
                  <Stack direction="column" spacing={1}>
                    <Typography variant="h4">{t(`buyPage.interested`)}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {t(`buyPage.fill_info`)}
                    </Typography>
                    <RHFTextField
                      name="name"
                      variant="standard"
                      placeholder={t(`enter_name`)}
                      label={t(`name`)}
                    />
                    <RHFTextField
                      name="email"
                      variant="standard"
                      placeholder="lorem@gmail.com"
                      label={t(`email`)}
                    />
                    <RHFTextField
                      name="phoneNumber"
                      variant="standard"
                      placeholder="(XX) 9999-9999"
                      label={t(`phone_whatsapp`)}
                    />
                    <RHFTextField
                      name="message"
                      variant="standard"
                      placeholder={t(`type_here`)}
                      label={t(`buyPage.message`)}
                    />
                  </Stack>

                  <FormControlLabel
                    control={<Checkbox name="gilad" />}
                    label={
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {t(`advertisePage.privacyPolicy`)}
                      </Typography>
                    }
                  />

                  <RoundButton type="submit" size="large" variant="contained" color="secondary">
                    {t(`buyPage.send_message`)}
                  </RoundButton>
                </Stack>
              </FormProvider>
            </Stack>
          </Grid>
        </Grid>

        <Stack alignItems="center" sx={{ my: 8 }}>
          <Box sx={{ height: '90px', width: '728px', bgcolor: '#D9D9D9' }} />
        </Stack>

        <Grid item xs={12}>
          <Stack alignItems="center">
            <Typography variant="h5" sx={{ textTransform: 'uppercase', color: '#587792' }}>
              {t(`featured_properties`)}
            </Typography>
            <Typography variant="h1" color="primary">
              {t(`buyPage.see_other_properties`)}
            </Typography>
          </Stack>
        </Grid>

        {/* <Grid item xs={12} container spacing={2} sx={{ pt: 5 }}>
          {[...new Array(4)].map(() => (
            <Grid item lg={3} md={4} xs={12}>
              <EstateCard price={8200000} bedrooms={3} suite={1} vacancies={6} area={394} />
            </Grid>
          ))}
        </Grid> */}

        <Stack alignItems="center" sx={{ pt: 8 }}>
          <Box sx={{ height: '250px', width: '970px', bgcolor: '#D9D9D9' }} />
        </Stack>
      </Container>
    </>
  );
}
