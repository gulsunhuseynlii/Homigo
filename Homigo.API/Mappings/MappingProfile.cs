using AutoMapper;
using Homigo.API.DTOs.Address;
using Homigo.API.DTOs.Category;
using Homigo.API.DTOs.Favorite;
using Homigo.API.DTOs.Order;
using Homigo.API.DTOs.Payment;
using Homigo.API.DTOs.Provider;
using Homigo.API.DTOs.Review;
using Homigo.API.DTOs.Service;
using Homigo.API.Entities;

namespace Homigo.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // -------------------- CATEGORY --------------------

        CreateMap<Category, CategoryDto>();

        // -------------------- SERVICE --------------------

        CreateMap<Service, ServiceDto>()
            .ForMember(x => x.CategoryName,
                opt => opt.MapFrom(x => x.Category.Name));

        // -------------------- ADDRESS --------------------

        CreateMap<Address, AddressDto>();

        // -------------------- PROVIDER --------------------

        CreateMap<ProviderProfile, ProviderDto>()
            .ForMember(x => x.FullName,
                opt => opt.MapFrom(x => x.User.FullName))
            .ForMember(x => x.Email,
                opt => opt.MapFrom(x => x.User.Email))
            .ForMember(x => x.PhoneNumber,
                opt => opt.MapFrom(x => x.PhoneNumber))
            .ForMember(x => x.ProfileImageUrl,
                opt => opt.MapFrom(x => x.ProfileImageUrl))
            .ForMember(x => x.CategoryName,
                opt => opt.MapFrom(x => x.Category.Name))
            .ForMember(x => x.Experience,
                opt => opt.MapFrom(x => $"{x.YearsOfExperience} years"))
            .ForMember(x => x.AverageRating,
                opt => opt.MapFrom(x =>
                    x.Reviews.Any()
                        ? x.Reviews.Average(r => r.Rating)
                        : 0));

        CreateMap<ProviderProfile, ProviderApplicationDto>()
            .ForMember(x => x.UserId,
                opt => opt.MapFrom(x => x.UserId))
            .ForMember(x => x.FullName,
                opt => opt.MapFrom(x => x.User.FullName))
            .ForMember(x => x.PhoneNumber,
                opt => opt.MapFrom(x => x.PhoneNumber))
            .ForMember(x => x.CategoryName,
                opt => opt.MapFrom(x => x.Category.Name))
            .ForMember(x => x.ProfileImageUrl,
                opt => opt.MapFrom(x => x.ProfileImageUrl))
            .ForMember(x => x.CvUrl,
                opt => opt.MapFrom(x => x.CvUrl))
            .ForMember(x => x.IdentityCardUrl,
                opt => opt.MapFrom(x => x.IdentityCardUrl))
            .ForMember(x => x.CertificateUrl,
                opt => opt.MapFrom(x => x.CertificateUrl));

        // -------------------- ORDER --------------------

        CreateMap<Order, OrderDto>()
            .ForMember(x => x.ServiceName,
                opt => opt.MapFrom(x => x.Service.Name))
            .ForMember(x => x.AddressTitle,
                opt => opt.MapFrom(x => x.Address.Title))
            .ForMember(x => x.ProviderName,
                opt => opt.MapFrom(x =>
                    x.Provider == null ? null : x.Provider.FullName))
            .ForMember(x => x.Status,
                opt => opt.MapFrom(x => x.Status.ToString()))
            .ForMember(x => x.CustomerName,
                opt => opt.MapFrom(x => x.Customer.FullName));

        // -------------------- PAYMENT --------------------

        CreateMap<Payment, PaymentDto>();

        // -------------------- REVIEW --------------------

        CreateMap<Review, ReviewDto>()
            .ForMember(x => x.CustomerName,
                opt => opt.MapFrom(x => x.Customer.FullName));

        // -------------------- FAVORITE --------------------

        CreateMap<Favorite, FavoriteDto>()
            .ForMember(x => x.ServiceName,
                opt => opt.MapFrom(x => x.Service.Name))
            .ForMember(x => x.BasePrice,
                opt => opt.MapFrom(x => x.Service.BasePrice))
            .ForMember(x => x.CategoryName,
                opt => opt.MapFrom(x => x.Service.Category.Name));
    }
}